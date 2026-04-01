import { SimplifiedContent } from '@/types';

interface SimplifiedViewProps {
  content: SimplifiedContent;
}

export function SimplifiedView({ content }: SimplifiedViewProps) {
  return (
    <div className="sv">
      <style>{`
        .sv {
          padding: 2rem;
          height: 100%;
          overflow-y: auto;
          background: var(--bg-color);
        }

        .sv-summary {
          background: linear-gradient(135deg, var(--primary) 0%, #172d4a 100%);
          border-radius: var(--radius-xl);
          padding: 2rem;
          margin-bottom: 2.5rem;
          color: white;
          box-shadow: var(--shadow-lg);
          position: relative;
          overflow: hidden;
        }

        .sv-summary::after {
          content: '';
          position: absolute;
          top: -20%;
          left: -10%;
          width: 40%;
          height: 140%;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%);
          transform: rotate(20deg);
          pointer-events: none;
        }

        .sv-summary-title {
          font-family: var(--font-display), var(--font-heebo), serif;
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sv-summary-type {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.12);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          letter-spacing: 0.02em;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sv-summary-text {
          font-size: 1.15rem;
          line-height: 1.75;
          opacity: 0.95;
          max-width: 95%;
        }

        .sv-section {
          margin-bottom: 2rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
          background: var(--surface);
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }

        .sv-section:hover {
          box-shadow: var(--shadow-md);
        }

        .sv-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          background: var(--surface-warm);
          border-bottom: 1px solid var(--border-color);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }

        .sv-section-title {
          font-family: var(--font-display), var(--font-heebo), serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary);
        }

        .sv-badge {
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
          border-radius: 200px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }

        .sv-badge-high { background: var(--success-light); color: var(--success); border: 1px solid rgba(29, 122, 95, 0.1); }
        .sv-badge-medium { background: var(--warning-light); color: var(--warning); border: 1px solid rgba(180, 83, 9, 0.1); }
        .sv-badge-low { background: var(--error-light); color: var(--error); border: 1px solid rgba(197, 48, 48, 0.1); }

        .sv-original {
          padding: 1.75rem 2rem;
          background: #fafafa;
          border-bottom: 1px dashed var(--border-color);
          position: relative;
        }

        .sv-original-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sv-original-label::after {
          content: '';
          flex-grow: 1;
          height: 1px;
          background: var(--border-color);
          opacity: 0.5;
        }

        .sv-original-content {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-secondary);
          font-family: inherit;
        }

        .sv-explanation {
          padding: 2rem;
          background: var(--surface);
          border-radius: 0 0 var(--radius-xl) var(--radius-xl);
        }

        .sv-explanation-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sv-explanation-content {
          font-size: 1.15rem;
          line-height: 1.85;
          color: var(--text-primary);
          font-weight: 450;
        }

        /* Bidi Stability Fixes */
        .bidi-text {
          unicode-bidi: isolate;
          text-align: right;
        }
        
        .bidi-ltr-run {
          direction: ltr;
          unicode-bidi: isolate;
          display: inline-block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
      `}</style>

      <div className="sv-summary animate-in animate-in-1">
        <div className="sv-summary-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          תקציר המסמך
        </div>
        <div className="sv-summary-type">
          {content.document_type}
        </div>
        <p className="sv-summary-text">{content.summary}</p>
      </div>

      {content.sections.map((section, index) => (
        <div key={index} className={`sv-section animate-in animate-in-${Math.min(index + 2, 5)}`}>
          <div className="sv-section-header">
            <span className="sv-section-title">{section.heading}</span>
            <span className={`sv-badge sv-badge-${section.confidence}`}>
              {section.confidence === 'high' ? 'אמינות גבוהה' :
               section.confidence === 'medium' ? 'אמינות בינונית' : 'נדרשת התייעצות'}
            </span>
          </div>

          <div className="sv-original">
            <div className="sv-original-label">טקסט מקור</div>
            <div className="sv-original-content">
              <BidiText text={section.original_text} />
            </div>
          </div>

          <div className="sv-explanation">
            <div className="sv-explanation-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              פיענוח ופישוט
            </div>
            <div className="sv-explanation-content">
              <BidiText text={section.simplified_text} isSimplified />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BidiText({ text, isSimplified = false }: { text: string; isSimplified?: boolean }) {
  if (!text) return null;

  // Split into lines first
  const lines = text.split('\n');

  return (
    <div className="bidi-text">
      {lines.map((line, i) => {
        if (!line.trim() && line.length === 0) return <div key={i} style={{ height: '0.75rem' }} />;
        
        // Strategy: Recognize English-heavy runs that include brackets and numbers
        // Regex handles: English words, numbers, brackets, and common medical symbols
        const parts = line.split(/([a-zA-Z0-9\(\)\[\]\.\:\-\+ ]*[a-zA-Z]+[a-zA-Z0-9\(\)\[\]\.\:\-\+ ]*)/g);
        
        return (
          <div key={i} style={{ marginBottom: '0.2rem' }}>
            {parts.map((part, pI) => {
              if (!part) return null;
              
              // If the part contains any English letters, wrap it as an LTR run
              if (/[a-zA-Z]/.test(part)) {
                return (
                  <span key={pI} className="bidi-ltr-run" dir="ltr">
                    {'\u200E'}{part}{'\u200E'}
                  </span>
                );
              }
              
              // For Hebrew/numeric parts, keep them in the ambient RTL
              return <span key={pI}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}
