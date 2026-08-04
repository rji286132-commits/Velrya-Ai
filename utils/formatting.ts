export function formatFileSize(bytes: number): string {
  if (!bytes && bytes !== 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(filename: string): string {
  if (!filename) return '';
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
}

export function isAllowedFile(filename: string): boolean {
  const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt', 'md'];
  return allowed.includes(getFileExtension(filename));
}

export function generateId(): string {
  return `velrya_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

export const MAX_FILE_SIZE = 10 * 1024; // 10MB for VELRYA AI
