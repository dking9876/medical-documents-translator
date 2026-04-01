'use client';

import { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'simplified' | 'original'>('simplified');

  if (!translation.simplified_content) return null;

  return (
    <div className="side-by-side-layout">
      <style>{`
        /* ── Mobile Tab Switcher ── */
        .mobile-tab-bar {
          display: flex;
          gap: 0;
          background: var(--surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          padding: 4px;
          margin-bottom: 0.75rem;
          box-shadow: var(--shadow-sm);
        }

        @media (min-width: 1024px) {
          .mobile-tab-bar { display: none; }
        }

        .mobile-tab-btn {
          flex: 1;
          padding: 0.7rem 0.5rem;
          border: none;
          background: transparent;
          font-family: var(--font-display), var(--font-heebo), sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-tab-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        .mobile-tab-btn:not(.active):active {
          background: var(--surface-warm);
        }

        /* ── Layout Grid ── */
        .side-by-side-layout {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        @media (min-width: 1024px) {
          .side-by-side-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            height: calc(100vh - 180px);
            min-height: 700px;
          }
        }

        /* ── Panels ── */
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

        /* On mobile, hide non-active panel */
        @media (max-width: 1023px) {
          .panel {
            border-radius: var(--radius-lg);
          }
          .panel.mobile-hidden {
            display: none;
          }
          .panel:not(.mobile-hidden) {
            max-height: calc(100vh - 230px);
            max-height: calc(100dvh - 230px);
          }
        }

        /* ── Panel Headers ── */
        .panel-header {
          border-bottom: 1px solid var(--border-color);
          padding: 0.75rem 1.25rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .panel-header {
            padding: 0.625rem 1rem;
            font-size: 0.82rem;
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

        /* ── Panel Content ── */
        .panel-content {
          flex: 1;
          overflow-y: auto;
          background: var(--surface);
          -webkit-overflow-scrolling: touch;
        }

        .panel-content.original-bg {
          background: var(--bg-color);
        }
      `}</style>

      {/* Mobile Tab Bar */}
      <div className="mobile-tab-bar">
        <button
          className={`mobile-tab-btn ${activeTab === 'simplified' ? 'active' : ''}`}
          onClick={() => setActiveTab('simplified')}
          aria-label="הצג פישוט"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          פישוט
        </button>
        <button
          className={`mobile-tab-btn ${activeTab === 'original' ? 'active' : ''}`}
          onClick={() => setActiveTab('original')}
          aria-label="הצג מסמך מקורי"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          מקור
        </button>
      </div>

      {/* Simplified Panel */}
      <div className={`panel simplified-panel ${activeTab !== 'simplified' ? 'mobile-hidden' : ''}`}>
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

      {/* Original Panel */}
      <div className={`panel original-panel ${activeTab !== 'original' ? 'mobile-hidden' : ''}`}>
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
