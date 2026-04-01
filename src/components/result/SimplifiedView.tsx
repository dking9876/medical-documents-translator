import { SimplifiedContent } from '@/types';

interface SimplifiedViewProps {
  content: SimplifiedContent;
}

export function SimplifiedView({ content }: SimplifiedViewProps) {
  return (
    <div className="sv">
      <style>{`
        .sv {
          padding: 1.5rem;
          height: 100%;
          overflow-y: auto;
          background: var(--bg-color);
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 640px) {
          .sv {
            padding: 1rem 0.875rem;
          }
        }

        /* ── Summary Card ── */
        .sv-summary {
          background: linear-gradient(135deg, var(--primary) 0%, #172d4a 100%);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 1.75rem;
          color: white;
          box-shadow: var(--shadow-lg);
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .sv-summary {
            padding: 1.125rem 1rem;
            margin-bottom: 1.25rem;
            border-radius: var(--radius);
          }
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
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        @media (max-width: 640px) {
          .sv-summary-title {
            font-size: 1.05rem;
            gap: 0.5rem;
          }
          .sv-summary-title svg {
            width: 20px;
            height: 20px;
          }
        }

        .sv-summary-type {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.12);
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          letter-spacing: 0.02em;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sv-summary-text {
          font-size: 1.05rem;
          line-height: 1.7;
          opacity: 0.95;
        }

        @media (max-width: 640px) {
          .sv-summary-text {
            font-size: 0.95rem;
            line-height: 1.65;
          }
        }

        /* ── Section Cards ── */
        .sv-section {
          margin-bottom: 1.25rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          background: var(--surface);
          box-shadow: var(--shadow-sm);
          transition: box-shadow var(--transition-normal);
        }

        @media (max-width: 640px) {
          .sv-section {
            margin-bottom: 1rem;
            border-radius: var(--radius);
          }
        }

        .sv-section:hover {
          box-shadow: var(--shadow-md);
        }

        .sv-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: var(--surface-warm);
          border-bottom: 1px solid var(--border-color);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          gap: 0.5rem;
        }

        @media (max-width: 640px) {
          .sv-section-header {
            padding: 0.75rem 0.875rem;
            border-radius: var(--radius) var(--radius) 0 0;
            flex-wrap: wrap;
          }
        }

        .sv-section-title {
          font-family: var(--font-display), var(--font-heebo), serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 640px) {
          .sv-section-title {
            font-size: 0.95rem;
          }
        }

        /* ── Badges ── */
        .sv-badge {
          font-size: 0.68rem;
          padding: 0.3rem 0.65rem;
          border-radius: 200px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sv-badge-high { background: var(--success-light); color: var(--success); border: 1px solid rgba(29, 122, 95, 0.1); }
        .sv-badge-medium { background: var(--warning-light); color: var(--warning); border: 1px solid rgba(180, 83, 9, 0.1); }
        .sv-badge-low { background: var(--error-light); color: var(--error); border: 1px solid rgba(197, 48, 48, 0.1); }

        /* ── Original Text Block ── */
        .sv-original {
          padding: 1.25rem 1.25rem 1.25rem 1.5rem;
          background: #F8FAFC;
          border-bottom: 1px dashed var(--border-color);
          border-right: 4px solid #CBD5E1;
          position: relative;
        }

        @media (max-width: 640px) {
          .sv-original {
            padding: 0.875rem 0.875rem 0.875rem 1rem;
            border-right-width: 3px;
          }
        }

        .sv-original-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sv-original-label-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: #E2E8F0;
          color: #64748b;
          flex-shrink: 0;
        }

        .sv-original-label::after {
          content: '';
          flex-grow: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .sv-original-content {
          font-size: 0.88rem;
          line-height: 1.75;
          color: #475569;
          font-family: inherit;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        @media (max-width: 640px) {
          .sv-original-content {
            font-size: 0.83rem;
            line-height: 1.65;
          }
        }

        /* ── Explanation Block ── */
        .sv-explanation {
          padding: 1.5rem 1.25rem 1.5rem 1.5rem;
          background: #FFFFFF;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          border-right: 4px solid var(--primary);
        }

        @media (max-width: 640px) {
          .sv-explanation {
            padding: 1rem 0.875rem 1rem 1rem;
            border-radius: 0 0 var(--radius) var(--radius);
            border-right-width: 3px;
          }
        }

        .sv-explanation-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .sv-explanation-label-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          flex-shrink: 0;
        }

        .sv-explanation-content {
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--text-primary);
          font-weight: 450;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        @media (max-width: 640px) {
          .sv-explanation-content {
            font-size: 0.95rem;
            line-height: 1.7;
          }
        }

        /* ── Bidi Stability ── */
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
            <div className="sv-original-label">
              <span className="sv-original-label-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </span>
              טקסט מקור
            </div>
            <div className="sv-original-content">
              <BidiText text={section.original_text} />
            </div>
          </div>

          <div className="sv-explanation">
            <div className="sv-explanation-label">
              <span className="sv-explanation-label-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
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

  const lines = text.split('\n');

  return (
    <div className="bidi-text">
      {lines.map((line, i) => {
        if (!line.trim() && line.length === 0) return <div key={i} style={{ height: '0.5rem' }} />;

        const parts = line.split(/([a-zA-Z0-9\(\)\[\]\.\:\-\+ ]*[a-zA-Z]+[a-zA-Z0-9\(\)\[\]\.\:\-\+ ]*)/g);

        return (
          <div key={i} style={{ marginBottom: '0.15rem' }}>
            {parts.map((part, pI) => {
              if (!part) return null;

              if (/[a-zA-Z]/.test(part)) {
                return (
                  <span key={pI} className="bidi-ltr-run" dir="ltr">
                    {'\u200E'}{part}{'\u200E'}
                  </span>
                );
              }

              return <span key={pI}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}
