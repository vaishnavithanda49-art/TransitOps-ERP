import { RequestHandler } from "express";
import { SendOtpResponse, VerifyOtpResponse } from "@shared/api";
import { isValidEmail, issueOtp, sendOtpEmail, verifyOtp } from "../utils/otp";

export const handleSendOtp: RequestHandler = async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";

    if (!email) {
      const response: SendOtpResponse = { ok: false, message: "Email is required." };
      return res.status(400).json(response);
    }

    if (!isValidEmail(email)) {
      const response: SendOtpResponse = { ok: false, message: "Enter a valid email address." };
      return res.status(400).json(response);
    }

    const issued = issueOtp(email);
    if (!issued.ok) {
      const response: SendOtpResponse = { ok: false, message: issued.message };
      return res.status(429).json(response);
    }

    const emailResult = await sendOtpEmail(email, issued.code);
    if (!emailResult.ok) {
      const response: SendOtpResponse = { ok: false, message: emailResult.message };
      return res.status(502).json(response);
    }

    const response: SendOtpResponse = {
      ok: true,
      message: "OTP sent successfully.",
      expiresInSeconds: 600,
    };
    return res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send OTP.";
    const response: SendOtpResponse = { ok: false, message };
    return res.status(500).json(response);
  }
};

export const handleVerifyOtp: RequestHandler = (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    const otp = typeof req.body?.otp === "string" ? req.body.otp.trim() : "";

    if (!email || !otp) {
      const response: VerifyOtpResponse = { ok: false, message: "Email and OTP are required." };
      return res.status(400).json(response);
    }

    if (!isValidEmail(email)) {
      const response: VerifyOtpResponse = { ok: false, message: "Enter a valid email address." };
      return res.status(400).json(response);
    }

    const result = verifyOtp(email, otp);
    if (!result.ok) {
      const message =
        result.reason === "expired"
          ? "Your verification code has expired. Please request a new one."
          : result.reason === "locked"
            ? "Too many incorrect attempts. Please request a new verification code."
            : "Invalid or expired OTP.";

      const response: VerifyOtpResponse = { ok: false, message };
      return res.status(401).json(response);
    }

    const response: VerifyOtpResponse = { ok: true, message: "OTP verified successfully." };
    return res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify OTP.";
    const response: VerifyOtpResponse = { ok: false, message };
    return res.status(500).json(response);
  }
};
