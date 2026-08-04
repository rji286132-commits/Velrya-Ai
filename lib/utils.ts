import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function truncateText(text: string, length: number = 100): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getInitials(name: string): string {
  if (!name) return 'V';
  return name
   .split(' ')
   .map((word) => word[0])
   .join('')
   .toUpperCase()
   .slice(0, 2);
}

export const VELRYA_BRAND = {
  name: 'VELRYA AI',
  short: 'VELRYA',
  glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
};
