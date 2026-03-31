'use client';

import { useState, useRef } from 'react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { UploadProgress } from './UploadProgress';
import { useRouter } from 'next/navigation';

export function DropZone() {
  const router = useRouter();
  const { state, upload, reset } = useDocumentUpload();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFile(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleFile = async (file: File) => {
    const translationId = await upload(file);
    if (translationId) {
      router.push(`/result/${translationId}`);
    }
  };

  if (state.status !== 'idle' && state.status !== 'error') {
    return <UploadProgress state={state} />;
  }

  return (
    <div className="upload-wrapper">
      <style>{`
        .upload-wrapper {
          width: 100%;
        }

        /* Card container — solid, no dashed border */
        .upload-card {
          background: var(--surface);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: box-shadow var(--transition-normal), border-color var(--transition-normal);
          position: relative;
        }

        .upload-card:hover {
          box-shadow: var(--shadow-lg);
          border-color: var(--border-active);
        }

        /* Drag overlay — appears on top when dragging */
        .drag-overlay {
          position: absolute;
          inset: 0;
          background: var(--accent-light);
          border: 2px solid var(--accent);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-fast);
        }

        .drag-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .drag-overlay-text {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Internal layout */
        .upload-body {
          padding: 2.25rem 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        @media (max-width: 560px) {
          .upload-body {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1.5rem;
          }
        }

        /* Document illustration — abstract, not a literal icon */
        .upload-visual {
          flex-shrink: 0;
          width: 72px;
          height: 88px;
          background: var(--primary-light);
          border-radius: var(--radius);
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
        }

        .upload-visual::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          background: var(--bg-color);
          border-bottom-left-radius: 6px;
        }

        .upload-visual::after {
          content: '';
          position: absolute;
          top: 18px;
          left: 14px;
          right: 14px;
          height: 3px;
          background: var(--primary);
          opacity: 0.15;
          border-radius: 2px;
          box-shadow: 
            0 10px 0 0 rgba(30, 58, 95, 0.1),
            0 20px 0 0 rgba(30, 58, 95, 0.1),
            0 30px 0 0 rgba(30, 58, 95, 0.07);
        }

        .upload-visual-accent {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: -4px;
          left: -4px;
          box-shadow: var(--shadow-sm);
        }

        /* Text + CTA area */
        .upload-content {
          flex: 1;
          min-width: 0;
        }

        .upload-heading {
          font-family: var(--font-display), var(--font-heebo), serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .upload-sub {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }

        .upload-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        @media (max-width: 560px) {
          .upload-actions {
            justify-content: center;
          }
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.5rem;
          min-height: 44px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .upload-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .upload-btn:active {
          transform: translateY(0);
        }

        .upload-btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .upload-drag-hint {
          font-size: 0.82rem;
          color: var(--border-active);
          font-weight: 500;
        }

        /* Footer strip with file info */
        .upload-footer {
          background: var(--surface-warm);
          border-top: 1px solid var(--border-color);
          padding: 0.65rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .upload-footer-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .upload-footer-item svg {
          color: var(--success);
          flex-shrink: 0;
        }

        /* Error state */
        .upload-error {
          margin-top: 1rem;
          color: var(--error);
          background: var(--error-light);
          padding: 0.875rem 1.25rem;
          border-radius: var(--radius);
          font-weight: 500;
          font-size: 0.9rem;
          animation: slideUp 0.3s ease-out;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div 
        className="upload-card"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay — only visible when dragging over */}
        <div className={`drag-overlay ${isDragging ? 'visible' : ''}`}>
          <div className="drag-overlay-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            שחררו כאן להעלאה
          </div>
        </div>

        <div className="upload-body">
          {/* Abstract document illustration */}
          <div className="upload-visual">
            <div className="upload-visual-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="upload-content">
            <h3 className="upload-heading">העלו מסמך רפואי</h3>
            <p className="upload-sub">
              בחרו קובץ PDF ונפשט אותו לשפה ברורה תוך שניות
            </p>
            <div className="upload-actions">
              <button 
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={handleKeyDown}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
                בחרו קובץ PDF
              </button>
              <span className="upload-drag-hint">או גררו לכאן</span>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="upload-footer">
          <span className="upload-footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            PDF בלבד
          </span>
          <span className="upload-footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            עד 10 עמודים
          </span>
          <span className="upload-footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            מוצפן ומאובטח
          </span>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="application/pdf"
          style={{ display: 'none' }} 
          aria-hidden="true"
        />
      </div>

      {state.status === 'error' && (
        <div className="upload-error">
          <span>{state.message}</span>
          <button className="btn btn-outline" onClick={reset}>
            נסו שוב
          </button>
        </div>
      )}
    </div>
  );
}
