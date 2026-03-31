'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Translation } from '@/types';

export function useDocumentProcess(translationId: string | null) {
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!translationId) return;

    async function poll() {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('id', translationId)
        .single();

      if (error) {
        setLoading(false);
        return;
      }

      setTranslation(data as Translation);

      if (data.status === 'completed' || data.status === 'error') {
        setLoading(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }

    // Initial fetch
    poll();

    // Poll every 3 seconds while pending/processing
    intervalRef.current = setInterval(poll, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [translationId]);

  return { translation, loading };
}
