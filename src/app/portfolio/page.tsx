import { Suspense } from 'react';
import { getPortfolioProjects } from '@/lib/portfolio/loader';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';

export const metadata = {
  title: 'Portfolio',
  description: 'AI automation projects and solutions by CushLabs',
};

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

      <Suspense>
        <PortfolioGrid projects={projects} />
      </Suspense>
    </div>
  );
}
