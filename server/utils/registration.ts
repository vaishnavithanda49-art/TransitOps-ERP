import crypto from "crypto";
import { getRegistrationEncryptionKey, getSupabaseAdmin } from "./supabase";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
export const TEMP_REGISTRATION_TABLE = "temporary_registrations";
const PROFILE_TABLE = "profiles";
const USERS_TABLE = "users";

const getSupabase = () => getSupabaseAdmin();
const getEncryptionKey = () => getRegistrationEncryptionKey();
const getNowIso = () => new Date().toISOString();

const generateOtpCode = () => crypto.randomInt(0, 1000000).toString().padStart(6, "0");

const createOtpHash = (code: string, salt: string) =>
  crypto.createHmac("sha256", salt).update(code).digest("hex");

const encryptValue = (value: string) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
};

const decryptValue = (blob: string) => {
  const [ivPart, tagPart, ciphertextPart] = blob.split(".");
  if (!ivPart || !tagPart || !ciphertextPart) throw new Error("Invalid encrypted data format.");
  const iv = Buffer.from(ivPart, "base64");
  const tag = Buffer.from(tagPart, "base64");
  const ciphertext = Buffer.from(ciphertextPart, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
};

const safeCompare = (left: string, right: string) => {
  const leftBuf = Buffer.from(left, "utf8");
  const rightBuf = Buffer.from(right, "utf8");
  if (leftBuf.length !== rightBuf.length) return false;
  return crypto.timingSafeEqual(leftBuf, rightBuf);
};

export type RegistrationPayload = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
};

export type TempRegistrationRecord = {
  email: string;
  full_name: string;
  phone: string;
  role: string;
  password_blob: string;
  otp_hash: string;
  otp_salt: string;
  attempt_count: number;
  expires_at: string;
  created_at: string;
  verified: boolean;
};

export const createOrUpdateRegistration = async (payload: RegistrationPayload) => {
  const email = payload.email.trim().toLowerCase();
  const otp = generateOtpCode();
  const otpSalt = crypto.randomBytes(16).toString("hex");
  const otpHash = createOtpHash(otp, otpSalt);

  const record = {
    email,
    full_name: payload.fullName.trim(),
    phone: payload.phone?.trim() ?? "",
    role: payload.role,
    password_blob: encryptValue(payload.password),
    otp_hash: otpHash,
    otp_salt: otpSalt,
    attempt_count: 0,
    expires_at: new Date(Date.now() + OTP_EXPIRY_MS).toISOString(),
    created_at: getNowIso(),
    verified: false,
  };

  const { error } = await getSupabase()
    .from(TEMP_REGISTRATION_TABLE)
    .upsert(record, { onConflict: "email" });

  if (error) throw new Error("Unable to store registration data.");
  return otp;
};

export const refreshRegistrationOtp = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const registration = await getPendingRegistration(normalizedEmail);
  if (!registration) throw new Error("No pending registration found for this email.");

  const otp = generateOtpCode();
  const otpSalt = crypto.randomBytes(16).toString("hex");
  const otpHash = createOtpHash(otp, otpSalt);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

  const { error } = await getSupabase()
    .from(TEMP_REGISTRATION_TABLE)
    .update({ otp_hash: otpHash, otp_salt: otpSalt, expires_at: expiresAt, attempt_count: 0 })
    .eq("email", normalizedEmail);

  if (error) throw new Error("Unable to refresh registration OTP.");
  return otp;
};

export const getPendingRegistration = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await getSupabase()
    .from<TempRegistrationRecord>(TEMP_REGISTRATION_TABLE)
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) throw new Error("Unable to read registration data.");
  return data ?? null;
};

export const removePendingRegistration = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const { error } = await getSupabase().from(TEMP_REGISTRATION_TABLE).delete().eq("email", normalizedEmail);
  if (error) throw new Error("Unable to cleanup registration data.");
};

export const buildVerificationEmail = (code: string) => ({
  subject: "TransitOps verification code",
  text: `Your TransitOps verification code is ${code}. It expires in 10 minutes.`,
  html: `<p>Your TransitOps verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
});

export const verifyRegistrationCode = async (email: string, code: string) => {
  const registration = await getPendingRegistration(email);
  if (!registration) return { valid: false as const, reason: "not_found" as const };
  if (registration.verified) return { valid: false as const, reason: "already_used" as const };

  if (Date.now() > new Date(registration.expires_at).getTime()) {
    await removePendingRegistration(email);
    return { valid: false as const, reason: "expired" as const };
  }

  if ((registration.attempt_count ?? 0) >= MAX_OTP_ATTEMPTS) {
    await removePendingRegistration(email);
    return { valid: false as const, reason: "too_many_attempts" as const };
  }

  const expectedHash = createOtpHash(code, registration.otp_salt);
  if (!safeCompare(expectedHash, registration.otp_hash)) {
    await getSupabase()
      .from(TEMP_REGISTRATION_TABLE)
      .update({ attempt_count: (registration.attempt_count ?? 0) + 1 })
      .eq("email", registration.email);
    return { valid: false as const, reason: "incorrect" as const };
  }

  await getSupabase().from(TEMP_REGISTRATION_TABLE).update({ verified: true }).eq("email", registration.email);
  return { valid: true as const, registration };
};

export const createSupabaseUserFromRegistration = async (registration: TempRegistrationRecord) => {
  const password = decryptValue(registration.password_blob);
  let user: { id: string } | null = null;

  const { data: userData, error: authError } = await getSupabase().auth.admin.createUser({
    email: registration.email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: registration.full_name,
      phone: registration.phone,
      role: registration.role,
    },
  });

  if (authError) {
    if (authError.message?.includes("already registered") || authError.message?.includes("duplicate")) {
      const { data: existingUser, error: fetchError } = await getSupabase().auth.admin.getUserByEmail(registration.email);
      if (fetchError || !existingUser?.user) throw new Error("Unable to resolve existing Supabase user.");
      user = existingUser.user;
    } else {
      throw new Error("Unable to create Supabase user.");
    }
  } else {
    user = userData?.user ?? null;
  }

  if (!user) throw new Error("Unable to create or resolve Supabase user.");

  const profile = {
    id: user.id,
    full_name: registration.full_name,
    email: registration.email,
    phone: registration.phone,
    role: registration.role,
    created_at: getNowIso(),
  };

  const profileErrors: string[] = [];
  const insertProfile = async () => {
    const { error } = await getSupabase().from(PROFILE_TABLE).insert(profile);
    if (error) profileErrors.push(`profiles:${error.code || error.message}`);
  };
  const insertUserProfile = async () => {
    const { error } = await getSupabase().from(USERS_TABLE).insert(profile);
    if (error) profileErrors.push(`users:${error.code || error.message}`);
  };

  await insertProfile();
  await insertUserProfile();

  const fatalErrors = profileErrors.filter(
    (m) => !m.includes("42P01") && !m.includes('relation "') && !m.includes("already exists")
  );
  if (fatalErrors.length > 0) throw new Error("Unable to save user profile information.");

  return { user };
};