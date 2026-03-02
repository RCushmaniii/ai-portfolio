'use client';

import { Button } from '@/components/ui/button';

export default function PortfolioError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-8">
        Failed to load portfolio projects. This is likely a temporary issue.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
