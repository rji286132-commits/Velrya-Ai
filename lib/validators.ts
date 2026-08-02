import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

export function validateEmail(email: string): boolean {
  try { emailSchema.parse(email); return true; } catch { return false; }
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase');
  if (!/[a-z]/.test(password)) errors.push('Must contain lowercase');
  if (!/[0-9]/.test(password)) errors.push('Must contain number');
  return { valid: errors.length === 0, errors };
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}