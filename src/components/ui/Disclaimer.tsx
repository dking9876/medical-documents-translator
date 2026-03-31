export function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`disclaimer-banner ${className}`}>
      <style>{`
        .disclaimer-banner {
          background-color: var(--warning-light);
          border-right: 4px solid var(--warning);
          padding: 1.25rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          color: var(--warning-dark);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }

        .disclaimer-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 1.05rem;
          color: var(--warning);
        }
      `}</style>

      <div className="disclaimer-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        אזהרה רפואית חשובה
      </div>
      <p style={{ margin: 0 }}>
        SimpleMed הוא כלי מבוסס בינה מלאכותית לפישוט טקסט רפואי בלבד. 
        <strong style={{ fontWeight: 700 }}> אין לראות בתוצאות ייעוץ רפואי, אבחנה או המלצה לטיפול. </strong>
        התוכנה עלולה לשגות או להחסיר פרטים. יש להתייעץ תמיד עם רופא מוסמך או איש מקצוע רפואי לפני קבלת כל החלטה בריאותית.
      </p>
    </div>
  );
}
