import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Fraunces, Commissioner } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import EmailDomainWarning from '@/components/EmailDomainWarning';

const sfPro = localFont({
  src: '../../fonts/SF-Pro.ttf',
  variable: '--font-sf-pro',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400'],
  display: 'swap',
});

const commissioner = Commissioner({
  subsets: ['latin'],
  variable: '--font-commissioner',
  display: 'swap',
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
    <html lang="en" className={`${sfPro.variable} ${fraunces.variable} ${commissioner.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-background">
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
