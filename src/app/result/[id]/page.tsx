'use client';

import { useState, useEffect, use } from 'react';
import { useDocumentProcess } from '@/hooks/useDocumentProcess';
import { SideBySideView } from '@/components/result/SideBySideView';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(true);
  const unwrappedParams = use(params);
  const translationId = unwrappedParams.id;
  
  const { translation, loading } = useDocumentProcess(translationId);

  useEffect(() => {
    if (translation?.status === 'completed' && translation.original_file_path) {
      supabase.storage
        .from('documents')
        .createSignedUrl(translation.original_file_path, 3600)
        .then(({ data }) => {
          if (data?.signedUrl) {
            setFileUrl(data.signedUrl);
          }
        });
      const timer = setTimeout(() => setShowSuccess(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [translation]);

  if (loading || translation?.status === 'processing') {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <LoadingSpinner text="מפענח ומפשט מונחים רפואיים..." />
      </div>
    );
  }

  if (translation?.status === 'error') {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ padding: '2rem', background: 'var(--error-light)', border: '1px solid var(--error)', borderRadius: 'var(--radius-lg)', color: 'var(--error)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.75rem', fontFamily: 'var(--font-display), var(--font-heebo), serif' }}>שגיאה בפענוח המסמך</h2>
          <p style={{ marginBottom: '1rem' }}>{translation.error_message}</p>
          <Link href="/" className="btn btn-primary">חזרה לדף הבית</Link>
        </div>
      </div>
    );
  }

  if (!translation || !translation.simplified_content || !fileUrl) {
    return (
      <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <LoadingSpinner text="מכין את התצוגה..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1600px', paddingTop: '1rem' }}>
      <style>{`
        @keyframes successFadeIn {
          0% { opacity: 0; transform: translateY(-8px) scale(0.98); }
          60% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-4px) scale(0.99); }
        }
        .success-banner {
          background: var(--success-light);
          border: 1px solid var(--success);
          border-radius: var(--radius-lg);
          padding: 0.75rem 1.25rem;
          margin-bottom: 1rem;
          text-align: center;
          color: var(--success);
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          animation: successFadeIn 2.2s ease-out forwards;
          font-size: 0.95rem;
        }
        @media (max-width: 640px) {
          .success-banner {
            padding: 0.625rem 1rem;
            font-size: 0.85rem;
            border-radius: var(--radius);
          }
        }
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .result-title {
          font-family: var(--font-display), var(--font-heebo), serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          word-break: break-word;
        }
        @media (max-width: 640px) {
          .result-title {
            font-size: 1rem;
          }
          .result-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          .result-header .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {showSuccess && (
        <div className="success-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          פענוח הושלם בהצלחה!
        </div>
      )}

      <Disclaimer className="mb-4" />
      
      <div className="result-header">
        <div>
          <h1 className="result-title">
            תוצאות פישוט: {translation.original_filename}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            נותח בהצלחה • {new Date(translation.created_at).toLocaleDateString('he-IL')}
          </p>
        </div>
        <div>
          <button 
            className="btn btn-outline" 
            onClick={() => window.print()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            הדפסה
          </button>
        </div>
      </div>

      <SideBySideView 
        translation={translation} 
        fileUrl={fileUrl}
      />
    </div>
  );
}
