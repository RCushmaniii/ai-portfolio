'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProjectError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-8">
        Failed to load this project. This is likely a temporary issue.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/portfolio">Back to Portfolio</Link>
        </Button>
      </div>
    </div>
  );
}
