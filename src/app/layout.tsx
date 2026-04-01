import '@/polyfill';
import type { Metadata } from "next";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "SimpleMed | תרגום מסמכים רפואיים",
  description: "מערכת תרגום מסמכים רפואיים מאובטחת, המפשטת מונחים רופאיים לשפה מובנת ונגישה.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${frankRuhlLibre.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="main-content">
          <header>
            <div className="container header-content">
              <Link href="/" className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
                </svg>
                SimpleMed
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/" className="btn btn-secondary">
                  מסמך חדש
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
