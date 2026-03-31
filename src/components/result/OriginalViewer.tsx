'use client';

import { useState } from 'react';
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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer-container">
      <style>{`
        .pdf-viewer-container {
          padding: 1rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .pdf-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          background: var(--surface);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .pdf-document {
          flex: 1;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          border-radius: var(--radius);
        }

        .pdf-page {
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
          border: 1px solid var(--border-color);
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
        <span className="font-semibold" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
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
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              טוען מסמך...
            </div>
          }
          error={
            <div style={{ color: 'var(--error)', padding: '2rem', textAlign: 'center', background: 'var(--error-light)', borderRadius: 'var(--radius)' }}>
              טעינת המסמך נכשלה. {error?.message}
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            className="pdf-page"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={calculateWidth()}
          />
        </Document>
      </div>
    </div>
  );
}

function calculateWidth() {
  if (typeof window !== 'undefined') {
    return Math.min(window.innerWidth / 2 - 100, 800);
  }
  return 600;
}
