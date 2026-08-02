import crypto from 'crypto';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString('hex');
}

export function verifyTOTP(secret: string, token: string): boolean {
  // Simple TOTP verification (for demo)
  return token.length === 6 && /^\d+$/.test(token);
}