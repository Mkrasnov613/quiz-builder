import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create and manage quizzes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-gray-50 font-sans antialiased">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
