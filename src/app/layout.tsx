import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import EmailDomainWarning from '@/components/EmailDomainWarning';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans'
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif'
});

export const metadata: Metadata = {
  title: 'DormSC',
  description: 'Discover the best student housing near USC',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-black">
            <Navbar />
            <EmailVerificationBanner />
            <EmailDomainWarning />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
