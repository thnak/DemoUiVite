import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postapiScriptTestexecute,
} from '../../services/generated/script-test';

import type {
  ObjectResult,
  ScriptExecutionRequest,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ScriptTest Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ScriptTest
 */
export const scriptTestKeys = {
  all: ['scriptTest'] as const,
};

/**
 * Compiles and executes a C# script.
 */
export function usePostapiScriptTestexecute(
  options?: Omit<UseMutationOptions<ObjectResult, Error, { data: ScriptExecutionRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: ScriptExecutionRequest }) => postapiScriptTestexecute(variables.data),
    ...options,
  });
}
