'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { validateFile } from '@/lib/pdf/validator';

export type UploadState =
  | { status: 'idle' }
  | { status: 'validating' }
  | { status: 'uploading'; progress: number }
  | { status: 'processing'; translationId: string }
  | { status: 'error'; message: string };

export function useDocumentUpload() {
  const [state, setState] = useState<UploadState>({ status: 'idle' });

  async function upload(file: File) {
    // Validate
    setState({ status: 'validating' });
    const validation = validateFile(file);
    if (!validation.valid) {
      setState({ status: 'error', message: validation.error! });
      return null;
    }

    try {
      // Upload to Supabase Storage
      setState({ status: 'uploading', progress: 0 });
      // Use only UUID and .pdf to avoid "Invalid key" errors with Hebrew filenames in Supabase Storage
      const filePath = `uploads/${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      setState({ status: 'uploading', progress: 60 });

      // Create translation record
      const { data: translation, error: dbError } = await supabase
        .from('translations')
        .insert({
          original_file_path: filePath,
          original_filename: file.name,
          status: 'pending',
        })
        .select('id')
        .single();

      if (dbError) throw new Error(dbError.message);

      setState({ status: 'uploading', progress: 80 });

      // Trigger edge function
      const { error: fnError } = await supabase.functions.invoke('process-document', {
        body: { translationId: translation.id, filePath },
      });

      if (fnError) console.warn('Edge function error:', fnError.message);

      setState({ status: 'processing', translationId: translation.id });
      return translation.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'שגיאה לא ידועה';
      setState({ status: 'error', message: `שגיאה בהעלאת הקובץ: ${message}` });
      return null;
    }
  }

  function reset() {
    setState({ status: 'idle' });
  }

  return { state, upload, reset };
}
