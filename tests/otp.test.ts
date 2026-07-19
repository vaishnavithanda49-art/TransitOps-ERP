import { describe, expect, it } from "vitest";
import {
  buildOtpEmailHtml,
  canSendOtp,
  clearOtpStore,
  generateOtpCode,
  isValidEmail,
  issueOtp,
  storeOtp,
  verifyOtp,
} from "../server/utils/otp";

describe("OTP verification helpers", () => {
  it("generates a 6-digit OTP", () => {
    const code = generateOtpCode();
    expect(code).toHaveLength(6);
    expect(/^\d{6}$/.test(code)).toBe(true);
  });

  it("validates email addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  it("verifies a valid OTP once and rejects reuse", () => {
    clearOtpStore();
    const code = generateOtpCode();
    storeOtp("user@example.com", code, 60 * 1000);

    const firstAttempt = verifyOtp("user@example.com", code);
    expect(firstAttempt.ok).toBe(true);

    const secondAttempt = verifyOtp("user@example.com", code);
    expect(secondAttempt.ok).toBe(false);
  });

  it("rejects expired OTP codes", () => {
    clearOtpStore();
    const code = generateOtpCode();
    storeOtp("expired@example.com", code, -1000);

    const result = verifyOtp("expired@example.com", code);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("expired");
  });

  it("locks verification after too many failed attempts", () => {
    clearOtpStore();
    const code = generateOtpCode();
    storeOtp("locked@example.com", code, 60 * 1000);

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const failedAttempt = verifyOtp("locked@example.com", "000000");
      expect(failedAttempt.ok).toBe(false);
      expect(failedAttempt.reason).toBe("invalid");
    }

    const lockedAttempt = verifyOtp("locked@example.com", "000000");
    expect(lockedAttempt.ok).toBe(false);
    expect(lockedAttempt.reason).toBe("locked");
  });

  it("rate limits OTP send requests", () => {
    clearOtpStore();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const issued = issueOtp("rate-limit@example.com");
      expect(issued.ok).toBe(true);
    }

    const blocked = canSendOtp("rate-limit@example.com");
    expect(blocked.allowed).toBe(false);
  });

  it("builds branded OTP email HTML with logo and code", () => {
    const html = buildOtpEmailHtml("123456");
    expect(html).toContain("123456");
    expect(html).toContain("TransitOps");
    expect(html).toContain("10 minutes");
    expect(html).toContain("Never share your OTP");
    expect(html).toContain("data:image/svg+xml;base64,");
  });
});
