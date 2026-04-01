export function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`disclaimer-banner ${className}`}>
      <style>{`
        .disclaimer-banner {
          background-color: var(--warning-light);
          border: 1px solid var(--warning);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-lg);
          color: var(--warning-dark);
          font-size: 0.9rem;
          line-height: 1.6;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .disclaimer-icon {
          color: var(--warning);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
      `}</style>
      
      <div className="disclaimer-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>

      <p style={{ margin: 0 }}>
        <strong>אזהרה רפואית חשובה: </strong>
        SimpleMed הוא כלי מבוסס בינה מלאכותית לפישוט טקסט רפואי בלבד. 
        <strong> אין לראות בתוצאות ייעוץ רפואי, אבחנה או המלצה לטיפול. </strong>
        התוכנה עלולה לשגות או להחסיר פרטים. יש להתייעץ תמיד עם רופא מוסמך או איש מקצוע רפואי לפני קבלת כל החלטה בריאותית.
      </p>
    </div>
  );
}
