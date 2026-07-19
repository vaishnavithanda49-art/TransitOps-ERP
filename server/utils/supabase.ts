import { createClient, SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const getSupabaseAdmin = (): SupabaseClient => {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
};

export const getRegistrationEncryptionKey = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const encryptionSecret = process.env.REGISTRATION_ENCRYPTION_KEY?.trim() || serviceRoleKey;

  if (!encryptionSecret) {
    throw new Error(
      "REGISTRATION_ENCRYPTION_KEY or SUPABASE_SERVICE_ROLE_KEY must be set for registration encryption."
    );
  }

  return crypto.createHash("sha256").update(encryptionSecret, "utf8").digest();
};
