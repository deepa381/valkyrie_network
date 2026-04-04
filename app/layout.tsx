import './globals.css';
import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Valkyrie Network — Build Startups. Find Co-Founders. Become a Leader.',
  description:
    'The global ecosystem for women founders to build startups, find co-founders, raise capital, and lead with confidence. AI-powered matching, founder intelligence, and a global community.',
  keywords: ['startup', 'co-founder', 'women founders', 'AI matching', 'ecosystem', 'entrepreneurship'],
  authors: [{ name: 'Valkyrie Network' }],
  openGraph: {
    title: 'Valkyrie Network',
    description: 'Build Startups. Find Co-Founders. Become a Leader.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valkyrie Network',
    description: 'Build Startups. Find Co-Founders. Become a Leader.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${inter.variable} ${syne.variable} font-sans antialiased`}
        style={{ background: '#0B0F19', color: '#F8FAFC' }}
      >
        {children}
      </body>
    </html>
  );
}
