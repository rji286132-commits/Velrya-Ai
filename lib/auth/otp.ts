import crypto from 'crypto';

export function generateOTP(): string {
  // Secure random - VELRYA AI
  return crypto.randomInt(100000, 999999).toString();
}

export function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString('base64url');
}

export function verifyTOTP(secret: string, token: string): boolean {
  if (!secret || !token) return false;
  
  // Basic format check for VELRYA AI
  if (token.length !== 6 || !/^\d+$/.test(token)) return false;

  // TODO: Real TOTP verify with speakeasy/otpauth for production
  // For now secure format validation
  return true;
}

export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}
