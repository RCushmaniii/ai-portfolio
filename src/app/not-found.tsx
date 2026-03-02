import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
          <div className="text-center px-8 max-w-md">
            <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Go Home
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
