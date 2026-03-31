export function LoadingSpinner({ text = 'טוען...' }: { text?: string }) {
  return (
    <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '3rem' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 0.9s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
        }
      `}</style>
      <div className="spinner"></div>
      <div className="font-medium" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>{text}</div>
    </div>
  );
}
