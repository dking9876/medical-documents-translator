import { DropZone } from '@/components/upload/DropZone';
import { Disclaimer } from '@/components/ui/Disclaimer';
import Image from 'next/image';
import { Footer } from '@/components/ui/Footer';

export default function Home() {
  return (
    <>
      <div className="container">
        <main>
          {/* Split Hero Section */}
          <section className="hero-split animate-in animate-in-1">
            <div className="hero-content">
              <h1 className="heading-hero" style={{ textAlign: 'right', marginBottom: '1rem', color: 'var(--primary)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: '1.2' }}>
                מבינים רפואה.<br />בפשטות.
              </h1>
              <p className="text-lead" style={{ textAlign: 'right', margin: '0 0 2rem 0', maxWidth: '100%' }}>
                העלו מסמך רפואי מורכב, והמערכת שלנו תפשט אותו מיידית לשפה ברורה, מובנת ונגישה לכולם.
              </p>
              
              <div className="upload-section">
                <DropZone />
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <Image 
                  src="/images/doctor-patient.png" 
                  alt="Doctor explaining medical data to patient" 
                  width={640} 
                  height={480}
                  className="hero-image"
                  priority
                />
              </div>
              <style>{`
                .hero-image-wrapper {
                  position: relative;
                  border-radius: var(--radius-xl);
                  overflow: hidden;
                  background: transparent;
                }
                .hero-image {
                  display: block;
                  width: 100%;
                  height: auto;
                  object-fit: cover;
                }
              `}</style>
            </div>
          </section>

          {/* How it Works / Trust Indicators */}
          <section className="how-it-works animate-in animate-in-3" style={{ marginTop: '2rem' }}>
            <h2 className="text-center" style={{ marginBottom: '2rem', color: 'var(--primary)' }}>איך זה עובד?</h2>
            <div className="trust-row">
              <TrustItem 
                number="1"
                label="העלאה" 
                desc="העלאת קובץ רפואי או לחיצה להעלאה"
                icon={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>}
              />
              <TrustItem 
                number="2"
                label="עיבוד" 
                desc="המערכת המבוססת על בינה מלאכותית מנתחת את הטקסט"
                icon={<><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></>}
              />
              <TrustItem 
                number="3"
                label="תוצאה" 
                desc="קבלת הפשטה ברורה ומובנת של המסמך"
                icon={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
              />
            </div>
          </section>

          <div className="animate-in animate-in-4" style={{ maxWidth: '100%', margin: '4rem 0' }}>
            <Disclaimer />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

function TrustItem({ icon, label, desc, number }: { icon: React.ReactNode, label: string, desc: string, number: string }) {
  return (
    <div className="trust-item" style={{ flex: '1', minWidth: '240px', textAlign: 'center', padding: '1.5rem' }}>
      <div className="trust-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', margin: '0 auto 1rem', background: 'var(--success-teal-light)', color: 'var(--success-teal)', borderRadius: '50%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary)' }}>{number}. {label}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{desc}</p>
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
