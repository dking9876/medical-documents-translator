import { DropZone } from '@/components/upload/DropZone';
import { Disclaimer } from '@/components/ui/Disclaimer';

export default function Home() {
  return (
    <div className="container">
      <main>
        {/* Vertical Narrative - Centered Focus */}
        <section className="hero-section animate-in animate-in-1">
          <h1 className="heading-hero">
            מבינים רפואה.<br />בפשטות.
          </h1>
          <p className="text-lead mx-auto">
            העלו מסמך רפואי מורכב, והמערכת שלנו תפשט אותו מיידית לשפה ברורה, מובנת ונגישה לכולם.
          </p>
        </section>
        
        {/* Upload as the Clear Focal Point */}
        <section className="upload-section animate-in animate-in-2">
          <DropZone />
        </section>

        {/* Subtle scroll cue */}
        <div className="scroll-hint animate-in animate-in-3" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Trust Indicators - Right After Upload */}
        <div className="trust-row animate-in animate-in-3">
          <TrustItem 
            icon={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
            label="הצפנה מקצה לקצה" 
          />
          <TrustItem 
            icon={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></>}
            label="נתונים נמחקים מיד" 
          />
          <TrustItem 
            icon={<><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>}
            label="AI רפואי מתקדם" 
          />
        </div>

        <div className="animate-in animate-in-4" style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <Disclaimer />
        </div>

        <section className="animate-in animate-in-5">
          <FeaturesList />
        </section>
      </main>
    </div>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="trust-item">
      <div className="trust-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      {label}
    </div>
  );
}

function FeaturesList() {
  return (
    <div className="grid-features">
      <div className="feature-item">
        <div className="feature-number">01</div>
        <h4 className="feature-title">אמינות לפני הכל</h4>
        <p className="feature-desc">הטקסט המקורי מוצג לצד הפישוט. ללא הוספת או החסרת מידע. מבוסס על מודלי AI מתקדמים שתוכננו לדייק.</p>
      </div>
      <div className="feature-item">
        <div className="feature-number">02</div>
        <h4 className="feature-title">מגוון מסמכים רחב</h4>
        <p className="feature-desc">תוצאות בדיקות דם, מכתבי שחרור ממיון, סיכומי ביקור מרופא מומחה, ומרשמים לתרופות.</p>
      </div>
      <div className="feature-item">
        <div className="feature-number">03</div>
        <h4 className="feature-title">פרטיות מוחלטת</h4>
        <p className="feature-desc">כל התקשורת מוצפנת. הנתונים מושמדים מיד לאחר העיבוד. שום דבר לא נשמר.</p>
      </div>
    </div>
  );
}
