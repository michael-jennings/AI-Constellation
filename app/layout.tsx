import './globals.css';
import Link from 'next/link';
import ContextDrawer from '../components/ContextDrawer';
import { ReactNode } from 'react';

export const metadata = { title: 'AI Constellation' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full">
        <nav className="bg-gray-800 text-white p-4 flex gap-4">
          <Link href="/" className="font-bold">
            Constellation
          </Link>
          <Link href="/artifacts">Artifacts</Link>
          <Link href="/stacks">Stacks</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/changes">Changes</Link>
          <button
            aria-label="edit context"
            onClick={() => document.dispatchEvent(new Event('open-context'))}
            className="ml-auto underline"
          >
            Context
          </button>
        </nav>
        <main className="p-4">{children}</main>
        <ContextDrawer />
      </body>
    </html>
  );
}
