/**
 * useAtosContext — Hook for setting ATOS context on page navigation.
 * 
 * This hook is used in module pages to automatically update ATOS's
 * context when the user navigates between sections. This ensures
 * ATOS always knows what the user is looking at and can provide
 * relevant, targeted intelligence.
 * 
 * Usage:
 *   useAtosContext('properties', propertyId, 'property');
 */

'use client';

import { useEffect } from 'react';
import { useAtosStore } from '@/stores/atos-store';

export function useAtosContext(
  module: string,
  entityId?: string,
  entityType?: string
) {
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext(module, entityId, entityType);
  }, [module, entityId, entityType, setContext]);
}
