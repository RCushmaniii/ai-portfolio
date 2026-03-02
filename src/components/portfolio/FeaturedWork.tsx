import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface FeaturedWorkProps {
  projects: PortfolioProject[];
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  const featured = projects
    .filter((p) => p.portfolio_featured)
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="container py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">Featured Work</h2>
        <p className="text-muted-foreground">
          Recent AI automation projects in production
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {featured.map((project) => (
          <Link
            key={project.slug}
            href={`/portfolio/${project.slug}`}
            className="group block rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-video overflow-hidden bg-muted">
              <Image
                src={project.thumbnail || project.thumbnail_fallback}
                alt={project.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {project.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {project.status}
                </Badge>
              </div>
              <h3 className="font-semibold line-clamp-1 mb-1">
                {project.headline || project.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.subheadline || project.tagline}
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-primary mt-3 group-hover:gap-2 transition-all">
                View Project <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          View all projects <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
