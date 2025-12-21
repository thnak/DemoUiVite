/**
 * React hook for managing ValidationResult state in forms
 * 
 * This hook provides utilities to:
 * - Store and manage ValidationResult from API responses
 * - Extract field-level errors for display
 * - Clear errors when fields are edited
 */

import type { FormFieldErrors, ValidationResult } from 'src/utils/validation-result';

import { useMemo, useState, useCallback } from 'react';

import {
  getFieldError,
  hasFieldError,
  getFieldErrors,
  getOverallMessage,
  isValidationSuccess,
  getAllErrorMessages,
} from 'src/utils/validation-result';

interface UseValidationResultReturn {
  /**
   * The current validation result
   */
  validationResult: ValidationResult | null;

  /**
   * Set the validation result from an API response
   */
  setValidationResult: (result: ValidationResult | null) => void;

  /**
   * Clear the validation result
   */
  clearValidationResult: () => void;

  /**
   * Field-level errors extracted from the validation result
   */
  fieldErrors: FormFieldErrors;

  /**
   * Overall validation message
   */
  overallMessage: string | null;

  /**
   * Whether the validation was successful
   */
  isSuccess: boolean;

  /**
   * Array of all error messages
   */
  allErrorMessages: string[];

  /**
   * Get error message for a specific field
   */
  getFieldErrorMessage: (fieldName: string) => string | null;

  /**
   * Check if a specific field has an error
   */
  hasError: (fieldName: string) => boolean;

  /**
   * Clear error for a specific field
   */
  clearFieldError: (fieldName: string) => void;
}

/**
 * Hook for managing ValidationResult state in forms
 * 
 * @example
 * ```tsx
 * const {
 *   validationResult,
 *   setValidationResult,
 *   fieldErrors,
 *   overallMessage,
 *   isSuccess,
 *   getFieldErrorMessage,
 *   hasError,
 *   clearFieldError,
 * } = useValidationResult();
 * 
 * // In mutation callback
 * onSuccess: (result) => {
 *   setValidationResult(result);
 *   if (isValidationSuccess(result)) {
 *     router.push('/list');
 *   }
 * }
 * 
 * // In form field
 * <TextField
 *   error={hasError('name')}
 *   helperText={getFieldErrorMessage('name')}
 *   onChange={(e) => {
 *     handleChange(e);
 *     clearFieldError('name');
 *   }}
 * />
 * ```
 */
export function useValidationResult(): UseValidationResultReturn {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const clearValidationResult = useCallback(() => {
    setValidationResult(null);
  }, []);

  const fieldErrors = useMemo(
    () => (validationResult ? getFieldErrors(validationResult) : {}),
    [validationResult]
  );

  const overallMessage = useMemo(
    () => (validationResult ? getOverallMessage(validationResult) : null),
    [validationResult]
  );

  const isSuccess = useMemo(
    () => (validationResult ? isValidationSuccess(validationResult) : false),
    [validationResult]
  );

  const allErrorMessages = useMemo(
    () => (validationResult ? getAllErrorMessages(validationResult) : []),
    [validationResult]
  );

  const getFieldErrorMessage = useCallback(
    (fieldName: string) => (validationResult ? getFieldError(validationResult, fieldName) : null),
    [validationResult]
  );

  const hasError = useCallback(
    (fieldName: string) => (validationResult ? hasFieldError(validationResult, fieldName) : false),
    [validationResult]
  );

  const clearFieldError = useCallback(
    (fieldName: string) => {
      setValidationResult((prev) => {
        if (!prev?.errors) return prev;

        const newErrors = { ...prev.errors };
        delete newErrors[fieldName];

        return {
          ...prev,
          errors: Object.keys(newErrors).length > 0 ? newErrors : null,
        };
      });
    },
    []
  );

  return {
    validationResult,
    setValidationResult,
    clearValidationResult,
    fieldErrors,
    overallMessage,
    isSuccess,
    allErrorMessages,
    getFieldErrorMessage,
    hasError,
    clearFieldError,
  };
}
