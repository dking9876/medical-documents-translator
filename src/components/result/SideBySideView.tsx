'use client';

import dynamic from 'next/dynamic';
import { SimplifiedView } from './SimplifiedView';

const OriginalViewer = dynamic(() => import('./OriginalViewer'), {
  ssr: false,
  loading: () => <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>טוען תצוגת PDF...</div>
});
import type { Translation } from '@/types';

interface SideBySideViewProps {
  translation: Translation;
  fileUrl: string;
}

export function SideBySideView({ translation, fileUrl }: SideBySideViewProps) {
  if (!translation.simplified_content) return null;

  return (
    <div className="side-by-side-layout">
      <style>{`
        .side-by-side-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 1024px) {
          .side-by-side-layout {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            height: calc(100vh - 180px);
            min-height: 700px;
          }
        }

        .panel {
          background: var(--surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow var(--transition-normal);
        }
        
        .panel:hover {
          box-shadow: var(--shadow-md);
        }

        .panel-header {
          border-bottom: 1px solid var(--border-color);
          padding: 0.875rem 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
        }

        @media (max-width: 640px) {
          .panel-header {
            padding: 0.75rem 1rem;
            font-size: 0.88rem;
          }
        }

        .panel-header.simplified-header {
          background: var(--primary);
          color: white;
          border-bottom: none;
        }

        .panel-header.original-header {
          background: var(--surface-warm);
          color: var(--text-secondary);
        }
        
        .panel-content {
          flex: 1;
          overflow-y: auto;
          background: var(--surface);
        }
        
        .panel-content.original-bg {
          background: var(--bg-color);
        }
      `}</style>
      
      <div className="panel simplified-panel">
        <div className="panel-header simplified-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          פישוט הפענוח הרפואי
        </div>
        <div className="panel-content">
          <SimplifiedView content={translation.simplified_content} />
        </div>
      </div>

      <div className="panel original-panel">
        <div className="panel-header original-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          המסמך המקורי
        </div>
        <div className="panel-content original-bg">
          <OriginalViewer url={fileUrl} />
        </div>
      </div>
      
    </div>
  );
}
