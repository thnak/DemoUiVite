import { useQuery } from '@tanstack/react-query';

import {
  getapireportsmetadata,
  getapireportsmetadataentityName,
  getapireportsmetadatacategories,
  getapireportsmetadatarelationships,
} from 'src/api/services/generated/reports';

// ----------------------------------------------------------------------

/**
 * Hook to fetch all available entities for reporting
 */
export function useReportEntities() {
  return useQuery({
    queryKey: ['report', 'entities'],
    queryFn: async () => {
      const result = await getapireportsmetadata();
      return result.value || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - metadata doesn't change often
  });
}

/**
 * Hook to fetch metadata for a specific entity
 */
export function useEntityMetadata(entityName: string | undefined) {
  return useQuery({
    queryKey: ['report', 'entity', entityName],
    queryFn: async () => {
      if (!entityName) return null;
      const result = await getapireportsmetadataentityName(entityName);
      return result.value || null;
    },
    enabled: !!entityName,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch all entity categories
 */
export function useEntityCategories() {
  return useQuery({
    queryKey: ['report', 'categories'],
    queryFn: async () => {
      const result = await getapireportsmetadatacategories();
      return result.value || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch all relationships between entities
 */
export function useEntityRelationships() {
  return useQuery({
    queryKey: ['report', 'relationships'],
    queryFn: async () => {
      const result = await getapireportsmetadatarelationships();
      return result.value || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
