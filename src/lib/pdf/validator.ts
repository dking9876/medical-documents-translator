export const MAX_FILE_SIZE_MB = 50;
export const MAX_PAGES = 10;
export const ALLOWED_TYPE = 'application/pdf';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  if (file.type !== ALLOWED_TYPE) {
    return { valid: false, error: 'יש להעלות קובץ PDF בלבד' };
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `גודל הקובץ חורג מ-${MAX_FILE_SIZE_MB}MB. אנא העלה קובץ קטן יותר`,
    };
  }
  return { valid: true };
}
