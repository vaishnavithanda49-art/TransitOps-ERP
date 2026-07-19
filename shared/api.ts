/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  ok: boolean;
  message: string;
  expiresInSeconds?: number;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  ok: boolean;
  message: string;
}
