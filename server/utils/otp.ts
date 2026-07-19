import { randomInt, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import nodemailer, { createTransport } from "nodemailer";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_LENGTH = 6;
export const MAX_SEND_ATTEMPTS = 3;
export const SEND_WINDOW_MS = 15 * 60 * 1000;
export const MAX_VERIFY_ATTEMPTS = 5;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OtpRecord {
  code: string;
  expiresAt: number;
  used: boolean;
  verifyAttempts: number;
}

interface SendRateRecord {
  count: number;
  windowStartedAt: number;
}

const otpStore = new Map<string, OtpRecord>();
const sendRateStore = new Map<string, SendRateRecord>();

export function isValidEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return EMAIL_REGEX.test(normalized) && normalized.length <= 254;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function generateOtpCode() {
  return randomInt(100000, 1000000).toString();
}

function secureCompare(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function canSendOtp(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const record = sendRateStore.get(normalizedEmail);
  const now = Date.now();

  if (!record || now - record.windowStartedAt > SEND_WINDOW_MS) {
    return { allowed: true as const };
  }

  if (record.count >= MAX_SEND_ATTEMPTS) {
    const retryAfterMs = SEND_WINDOW_MS - (now - record.windowStartedAt);
    return {
      allowed: false as const,
      message: `Too many OTP requests. Try again in ${Math.ceil(retryAfterMs / 60000)} minute(s).`,
    };
  }

  return { allowed: true as const };
}

function recordSendAttempt(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const now = Date.now();
  const record = sendRateStore.get(normalizedEmail);

  if (!record || now - record.windowStartedAt > SEND_WINDOW_MS) {
    sendRateStore.set(normalizedEmail, { count: 1, windowStartedAt: now });
    return;
  }

  record.count += 1;
  sendRateStore.set(normalizedEmail, record);
}

export function storeOtp(email: string, code: string, ttlMs: number = OTP_TTL_MS) {
  const normalizedEmail = normalizeEmail(email);
  otpStore.set(normalizedEmail, {
    code,
    expiresAt: Date.now() + ttlMs,
    used: false,
    verifyAttempts: 0,
  });
}

export function verifyOtp(email: string, code: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedCode = code.trim();
  const record = otpStore.get(normalizedEmail);

  if (!record || record.used) {
    return { ok: false as const, reason: "invalid" as const };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { ok: false as const, reason: "expired" as const };
  }

  if (!/^\d{6}$/.test(normalizedCode)) {
    return { ok: false as const, reason: "invalid" as const };
  }

  record.verifyAttempts += 1;

  if (!secureCompare(record.code, normalizedCode)) {
    if (record.verifyAttempts >= MAX_VERIFY_ATTEMPTS) {
      otpStore.delete(normalizedEmail);
      return { ok: false as const, reason: "locked" as const };
    }

    otpStore.set(normalizedEmail, record);
    return { ok: false as const, reason: "invalid" as const };
  }

  record.used = true;
  otpStore.delete(normalizedEmail);
  return { ok: true as const };
}

export function clearOtpStore() {
  otpStore.clear();
  sendRateStore.clear();
}

export function getOtpRecord(email: string) {
  return otpStore.get(normalizeEmail(email)) ?? null;
}

function getLogoDataUri() {
  const logoPath = resolve(process.cwd(), "public", "transitops-logo.svg");
  const svg = readFileSync(logoPath, "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function buildOtpEmailHtml(otp: string) {
  const templatePath = resolve(process.cwd(), "templates", "otp_verification_email.html");
  const template = readFileSync(templatePath, "utf8");
  return template
    .replace(/\{\{OTP\}\}/g, otp)
    .replace(/\{\{LOGO_URL\}\}/g, getLogoDataUri());
}

export async function sendOtpEmail(to: string, otp: string): Promise<{ ok: boolean; message?: string }> {
  try {
    let host = process.env.SMTP_HOST;
    let port = Number(process.env.SMTP_PORT ?? 587);
    let user = process.env.SMTP_USER;
    let pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM ?? "TransitOps Security <no-reply@transitops.com>";

    if (!host || !user || !pass) {
      console.log("No SMTP credentials found in environment. Generating Ethereal Email account for testing...");
      const testAccount = await nodemailer.createTestAccount();
      host = testAccount.smtp.host;
      port = testAccount.smtp.port;
      user = testAccount.user;
      pass = testAccount.pass;
    }

    const transporter = createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
    from,
    to,
    subject: "TransitOps – Your Verification Code",
    html: buildOtpEmailHtml(otp),
    text: [
      "Hello, welcome to TransitOps.",
      "",
      `Your verification code is: ${otp}`,
      "",
      "This code expires in 10 minutes and can be used only once.",
      "",
      "Security alerts:",
      "- Never share your OTP with anyone.",
      "- TransitOps Support will never ask for your OTP.",
      "- If you did not request this code, you can safely ignore this email.",
    ].join("\n"),
  });

    if (host === "smtp.ethereal.email") {
      console.log("OTP Email sent via Ethereal Email.");
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Email send failed." };
  }
}

export function issueOtp(email: string) {
  const sendCheck = canSendOtp(email);
  if (!sendCheck.allowed) {
    return { ok: false as const, message: sendCheck.message };
  }

  const code = generateOtpCode();
  storeOtp(email, code);
  recordSendAttempt(email);

  return { ok: true as const, code };
}
