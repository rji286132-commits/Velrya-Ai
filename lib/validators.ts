import { z } from 'zod';

export const emailSchema = z.string().trim().toLowerCase().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long');

export const chatSchema = z.string().trim().min(1, 'Message cannot be empty').max(10000);

export function validateEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (password.length > 128) errors.push('Too long - max 128 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Must contain lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Must contain a number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Add special character for VELRYA AI security');
  return { valid: errors.length === 0, errors };
}

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .slice(0, 10000);
}

export function isSafePrompt(input: string): boolean {
  // Block prompt injections for VELRYA AI
  const blocked = ['ignore previous', 'system:', 'super_admin', 'role:'];
  return !blocked.some((b) => input.toLowerCase().includes(b));
}
