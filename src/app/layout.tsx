import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import EmailDomainWarning from '@/components/EmailDomainWarning';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const goldenGoose = localFont({
  src: '../../fonts/GoldenGooseUppercase-VariableVF.ttf',
  variable: '--font-golden-goose',
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
    <html lang="en" className={`${inter.variable} ${goldenGoose.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
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
