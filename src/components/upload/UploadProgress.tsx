import type { UploadState } from '@/hooks/useDocumentUpload';

const STAGES = [
  { key: 'validating', label: 'בודק תקינות', icon: '🔍' },
  { key: 'uploading', label: 'מעלה מסמך', icon: '📤' },
  { key: 'processing', label: 'מפענח ומפשט', icon: '🧠' },
];

export function UploadProgress({ state }: { state: UploadState }) {
  if (state.status === 'idle' || state.status === 'error') return null;

  const currentIndex = STAGES.findIndex(s => s.key === state.status);
  const isUploading = state.status === 'uploading';
  const progress = isUploading ? state.progress : (state.status === 'processing' ? 100 : 50);

  return (
    <div className="progress-card card">
      <style>{`
        .progress-card {
          text-align: center;
          padding: 2.5rem 2rem;
          animation: fadeSlideUp var(--transition-normal);
        }
        
        .progress-stages {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          direction: ltr;
        }

        .stage {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--border-active);
          transition: color var(--transition-normal);
        }

        .stage.active {
          color: var(--accent);
          font-weight: 700;
        }

        .stage.done {
          color: var(--success);
        }

        .stage-connector {
          width: 24px;
          height: 2px;
          background: var(--border-color);
          border-radius: 1px;
        }

        .stage-connector.done {
          background: var(--success);
        }

        .progress-bar-container {
          width: 100%;
          height: 6px;
          background-color: var(--border-color);
          border-radius: var(--radius);
          overflow: hidden;
          margin: 1.5rem 0;
          box-shadow: inset 0 1px 2px rgba(28, 35, 49, 0.04);
        }
        
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-hover));
          border-radius: var(--radius);
          transition: width var(--transition-normal);
          position: relative;
        }
        
        .progress-bar-fill::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite linear;
        }

        .pulse-icon {
          color: var(--accent);
          animation: pulse 2s infinite ease-in-out;
          margin-bottom: 1rem;
          display: inline-block;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      
      <div className="pulse-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>

      <div className="progress-stages">
        {STAGES.map((stage, i) => (
          <span key={stage.key} style={{ display: 'contents' }}>
            {i > 0 && <span className={`stage-connector ${i <= currentIndex ? 'done' : ''}`} />}
            <span className={`stage ${i < currentIndex ? 'done' : i === currentIndex ? 'active' : ''}`}>
              {stage.icon} {stage.label}
            </span>
          </span>
        ))}
      </div>

      <h3 className="font-semibold" style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
        {state.status === 'validating' ? 'מוודא תקינות קובץ...' :
         state.status === 'uploading' ? 'מעלה מסמך מאובטח...' :
         'מפענח ומפשט מונחים רפואיים...'}
      </h3>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      
      <p className="text-caption">
        {state.status === 'processing' 
          ? 'סבלנות, המערכת קוראת את המסמך בתשומת לב כדי להבטיח מענה מדויק.'
          : 'ההעלאה מוצפנת ומאובטחת.'
        }
      </p>
    </div>
  );
}
