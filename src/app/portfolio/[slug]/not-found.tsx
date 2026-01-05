import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The project you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/portfolio">Back to Portfolio</Link>
      </Button>
    </div>
  );
}
