import { SimplifiedContent } from '@/types';

interface SimplifiedViewProps {
  content: SimplifiedContent;
}

export function SimplifiedView({ content }: SimplifiedViewProps) {
  return (
    <div className="sv">
      <style>{`
        .sv {
          padding: 1.75rem;
          height: 100%;
          overflow-y: auto;
        }

        .sv-summary {
          background: var(--primary);
          border-radius: var(--radius-lg);
          padding: 1.75rem 2rem;
          margin-bottom: 2rem;
          color: white;
        }

        .sv-summary-title {
          font-family: var(--font-display), var(--font-heebo), serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.9;
        }

        .sv-summary-type {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .sv-summary-text {
          font-size: 1.05rem;
          line-height: 1.8;
          opacity: 0.92;
        }

        .sv-section {
          margin-bottom: 1.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          overflow: hidden;
          background: var(--surface);
        }

        .sv-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 1.75rem;
          background: var(--surface-warm);
          border-bottom: 1px solid var(--border-color);
          gap: 0.75rem;
        }

        .sv-section-title {
          font-family: var(--font-display), var(--font-heebo), serif;
          font-size: 1.12rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.3;
        }

        .sv-badge {
          font-size: 0.72rem;
          padding: 0.3rem 0.6rem;
          border-radius: 100px;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sv-badge-high { background: var(--success-light); color: var(--success); }
        .sv-badge-medium { background: var(--warning-light); color: var(--warning); }
        .sv-badge-low { background: var(--error-light); color: var(--error); }

        .sv-original {
          margin: 0;
          padding: 1.5rem 1.75rem;
          background: var(--bg-color);
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }

        .sv-original::before {
          content: '';
          position: absolute;
          top: 1rem;
          bottom: 1rem;
          right: 0;
          width: 3px;
          background: var(--primary);
          border-radius: 0 2px 2px 0;
          opacity: 0.25;
        }

        .sv-original-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.6rem;
          opacity: 0.6;
        }

        .sv-original-content {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-secondary);
          white-space: pre-wrap;
        }

        .sv-explanation {
          padding: 1.5rem 1.75rem;
          position: relative;
        }

        .sv-explanation::before {
          content: '';
          position: absolute;
          top: 1rem;
          bottom: 1rem;
          right: 0;
          width: 3px;
          background: var(--accent);
          border-radius: 0 2px 2px 0;
        }

        .sv-explanation-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.6rem;
        }

        .sv-explanation-content {
          font-size: 1.08rem;
          line-height: 1.9;
          color: var(--text-primary);
        }
      `}</style>

      <div className="sv-summary">
        <div className="sv-summary-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          תקציר המסמך
        </div>
        <div className="sv-summary-type">סוג: {content.document_type}</div>
        <p className="sv-summary-text">{content.summary}</p>
      </div>

      {content.sections.map((section, index) => (
        <div key={index} className="sv-section">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              הסבר פשוט
            </div>
            <div className="sv-explanation-content">
              <BidiText text={section.simplified_text} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BidiText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {lines.map((line, i) => {
        if (!line.trim() && line.length === 0) return <div key={i} style={{ height: '1rem' }} />;
        const parts = line.split(/([a-zA-Z][a-zA-Z0-9]*)/g);
        const firstStrong = line.match(/[a-zA-Zא-ת]/);
        const isRtl = firstStrong ? /[א-ת]/.test(firstStrong[0]) : true;
        return (
          <div
            key={i}
            dir={isRtl ? 'rtl' : 'ltr'}
            style={{ textAlign: isRtl ? 'right' : 'left', lineHeight: 'inherit' }}
          >
            {parts.map((part, pI) => {
              if (!part) return null;
              if (/[a-zA-Z]/.test(part)) {
                return <bdi key={pI} dir="ltr">{'\u200E'}{part}{'\u200E'}</bdi>;
              }
              return <span key={pI}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}
