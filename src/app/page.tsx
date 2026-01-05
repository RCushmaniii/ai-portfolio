import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">CushLabs.ai</h1>
      <p className="text-xl text-muted-foreground mb-8">
        AI Consulting & Automation for SMBs
      </p>
      <Button size="lg" asChild>
        <Link href="/portfolio">View Portfolio</Link>
      </Button>
    </div>
  );
}
