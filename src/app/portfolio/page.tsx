import { Suspense } from 'react';
import { getPortfolioProjects } from '@/lib/portfolio/loader';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Portfolio',
  description: 'AI automation projects and solutions by CushLabs',
};

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-lg" />
      ))}
    </div>
  );
}

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
        <p className="text-muted-foreground">
          AI-powered solutions and automation projects
        </p>
      </div>

      <Suspense fallback={<LoadingGrid />}>
        <PortfolioGrid projects={projects} />
      </Suspense>
    </div>
  );
}
