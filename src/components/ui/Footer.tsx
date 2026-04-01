'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer-professional">
      <style>{`
        .footer-professional {
          padding: 3rem 0;
          background: var(--bg-color);
          border-top: 1px solid var(--border-color);
          margin-top: 2rem;
        }

        @media (max-width: 640px) {
          .footer-professional {
            padding: 2rem 0;
            margin-top: 1rem;
          }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          align-items: flex-end;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
            justify-items: center;
            gap: 1.5rem;
          }
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--primary);
          font-size: 1.1rem;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .footer-logo {
            justify-content: center;
          }
          .social-links {
            justify-content: center;
          }
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.4rem;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .social-icon:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
        }

        .footer-testimonial {
          background: white;
          padding: 1.125rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          max-width: 320px;
          box-shadow: var(--shadow-sm);
          text-align: right;
          position: relative;
        }

        @media (max-width: 768px) {
          .footer-testimonial {
            max-width: 100%;
            width: 100%;
          }
        }

        .testimonial-text {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0.6rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: flex-end;
        }

        .author-info {
          text-align: left;
        }

        .author-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .author-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #eee;
          overflow: hidden;
        }
      `}</style>
      
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
            </svg>
            SimpleMed
          </Link>
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} SimpleMed. כל הזכויות שמורות.<br />
            הופכים מידע רפואי לנגיש עבור כולם.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16m-16 0l16-16"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 103.38 103.38 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 103.38 103.38 0 0 1-15 0 2 2 0 0 1-2-2Z"/><path d="m10 15 5-3-5-3v6Z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-testimonial">
          <p className="testimonial-text">
            "הצלגתם להנגיש לי מידע רפואי קריטי, תודה לכם על עזרה למדינה ולחברה..."
          </p>
          <div className="testimonial-author">
            <div className="author-info">
              <div className="author-name">יחיאל דיין</div>
            </div>
            <div className="author-img">
              <img src="/api/placeholder/32/32" alt="יחיאל דיין" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
