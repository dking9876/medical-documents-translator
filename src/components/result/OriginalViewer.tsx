'use client';

import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface OriginalViewerProps {
  url: string;
}

export default function OriginalViewer({ url }: OriginalViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<Error | null>(null);
  const [pdfWidth, setPdfWidth] = useState<number>(600);

  const updateWidth = useCallback(() => {
    const vw = window.innerWidth;
    if (vw < 640) {
      // Mobile: full width minus container padding
      setPdfWidth(vw - 48);
    } else if (vw < 1024) {
      // Tablet: leave some margin
      setPdfWidth(Math.min(vw - 80, 800));
    } else {
      // Desktop: half screen minus panel chrome
      setPdfWidth(Math.min(vw / 2 - 100, 800));
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer-container">
      <style>{`
        .pdf-viewer-container {
          padding: 0.75rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 640px) {
          .pdf-viewer-container {
            padding: 0.5rem;
          }
        }

        .pdf-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          background: var(--surface);
          padding: 0.6rem 1rem;
          border-radius: var(--radius);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 640px) {
          .pdf-controls {
            padding: 0.5rem 0.75rem;
            gap: 0.25rem;
          }
          .pdf-controls .btn {
            padding: 0.4rem 0.75rem;
            font-size: 0.8rem;
            min-height: 36px;
          }
        }

        .pdf-page-counter {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .pdf-page-counter {
            font-size: 0.78rem;
          }
        }

        .pdf-document {
          flex: 1;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          border-radius: var(--radius);
          -webkit-overflow-scrolling: touch;
        }

        .pdf-page {
          box-shadow: var(--shadow-md);
          margin-bottom: 1rem;
          border: 1px solid var(--border-color);
        }

        @media (max-width: 640px) {
          .pdf-page {
            box-shadow: var(--shadow-sm);
            margin-bottom: 0.75rem;
          }
        }
      `}</style>

      <div className="pdf-controls">
        <button
          className="btn btn-outline"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(prev => prev - 1)}
        >
          קודם
        </button>
        <span className="pdf-page-counter">
          עמוד {pageNumber} מתוך {numPages || '--'}
        </span>
        <button
          className="btn btn-outline"
          disabled={numPages ? pageNumber >= numPages : true}
          onClick={() => setPageNumber(prev => prev + 1)}
        >
          הבא
        </button>
      </div>

      <div className="pdf-document">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => setError(err)}
          loading={
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              טוען מסמך...
            </div>
          }
          error={
            <div style={{ color: 'var(--error)', padding: '1.5rem', textAlign: 'center', background: 'var(--error-light)', borderRadius: 'var(--radius)' }}>
              טעינת המסמך נכשלה. {error?.message}
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            className="pdf-page"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={pdfWidth}
          />
        </Document>
      </div>
    </div>
  );
}
