import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Japanese SRS System',
  description: 'Spaced Repetition System optimized for Japanese learning with FSRS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
