'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '480px' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            Something Went Wrong
          </h1>
          <p
            style={{
              color: '#a1a1aa',
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred. This is likely a temporary issue.
          </p>
          {error.digest && (
            <p
              style={{
                color: '#71717a',
                fontSize: '0.75rem',
                marginBottom: '1.5rem',
                fontFamily: 'monospace',
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: '#fafafa',
                color: '#0a0a0a',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Try Again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders outside root layout; Link requires router context */}
            <a
              href="/"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.375rem',
                border: '1px solid #27272a',
                backgroundColor: 'transparent',
                color: '#fafafa',
                fontWeight: 500,
                textDecoration: 'none',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
