import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FeaturedWork } from '@/components/portfolio/FeaturedWork';
import { getPortfolioProjects } from '@/lib/portfolio/loader';

export default async function HomePage() {
  const projects = await getPortfolioProjects();

  return (
    <>
      <div className="container py-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">CushLabs.ai</h1>
        <p className="text-xl text-muted-foreground mb-4">
          AI Consulting & Automation for SMBs
        </p>
        <p className="text-muted-foreground mb-8">
          Custom AI solutions that reduce manual work, cut response times, and scale
          operations — built by Robert Cushman for businesses in Mexico and LATAM.
          Browse the portfolio to see real projects in production.
        </p>
        <Button size="lg" asChild>
          <Link href="/portfolio">View Portfolio</Link>
        </Button>
      </div>

      <FeaturedWork projects={projects} />
    </>
  );
}
