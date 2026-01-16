/**
 * Utility functions for handling API ValidationResult responses
 *
 * The API returns ValidationResult objects for create/update/delete operations
 * with field-level error information that can be displayed in forms.
 */

import type { ValidationError, ValidationSeverity } from 'src/api/types/generated';

/**
 * Represents a validation result from the API
 */
export interface ValidationResult {
  isValid?: boolean;
  message?: string | null;
  errors?: Record<string, ValidationError> | null;
}

/**
 * Form field errors for displaying validation errors
 */
export interface FormFieldErrors {
  [fieldName: string]: {
    message: string;
    severity: ValidationSeverity;
  };
}

/**
 * Extract field errors from a ValidationResult
 *
 * @param result - The validation result from the API
 * @returns Record of field names to error messages and severity
 */
export function getFieldErrors(result: ValidationResult): FormFieldErrors {
  if (!result.errors) {
    return {};
  }

  const fieldErrors: FormFieldErrors = {};

  for (const [fieldName, error] of Object.entries(result.errors)) {
    if (error.message) {
      fieldErrors[fieldName] = {
        message: error.message,
        severity: error.severity || 'error',
      };
    }
  }

  return fieldErrors;
}

/**
 * Get the overall error message from a ValidationResult
 *
 * @param result - The validation result from the API
 * @returns The overall error message or null
 */
export function getOverallMessage(result: ValidationResult): string | null {
  return result.message || null;
}

/**
 * Check if a ValidationResult indicates success
 *
 * @param result - The validation result from the API
 * @returns true if the operation was successful
 */
export function isValidationSuccess(result: ValidationResult): boolean {
  return result.isValid === true;
}

/**
 * Get a summary of all errors from a ValidationResult
 * Useful for displaying in a snackbar or alert
 *
 * @param result - The validation result from the API
 * @returns Array of error messages
 */
export function getAllErrorMessages(result: ValidationResult): string[] {
  const messages: string[] = [];

  // Add overall message if present
  if (result.message) {
    messages.push(result.message);
  }

  // Add field-specific errors
  if (result.errors) {
    for (const [fieldName, error] of Object.entries(result.errors)) {
      if (error.message) {
        messages.push(`${fieldName}: ${error.message}`);
      }
    }
  }

  return messages;
}

/**
 * Get field error message for a specific field
 *
 * @param result - The validation result from the API
 * @param fieldName - The name of the field
 * @returns The error message for the field or null
 */
export function getFieldError(result: ValidationResult, fieldName: string): string | null {
  if (!result.errors || !result.errors[fieldName]) {
    return null;
  }

  return result.errors[fieldName].message || null;
}

/**
 * Check if a specific field has an error
 *
 * @param result - The validation result from the API
 * @param fieldName - The name of the field
 * @returns true if the field has an error
 */
export function hasFieldError(result: ValidationResult, fieldName: string): boolean {
  return getFieldError(result, fieldName) !== null;
}

/**
 * Get the severity of a field error
 *
 * @param result - The validation result from the API
 * @param fieldName - The name of the field
 * @returns The severity level or 'error' as default
 */
export function getFieldErrorSeverity(
  result: ValidationResult,
  fieldName: string
): ValidationSeverity {
  if (!result.errors || !result.errors[fieldName]) {
    return 'error';
  }

  return result.errors[fieldName].severity || 'error';
}
