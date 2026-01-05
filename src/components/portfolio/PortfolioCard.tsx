import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface PortfolioCardProps {
  project: PortfolioProject;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {project.portfolio_featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
            Featured
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline">{project.category}</Badge>
          {project.github_stars > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-4 w-4 fill-current" />
              {project.github_stars}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 mt-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.tagline}
        </p>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-1">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.tech_stack.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tech_stack.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/portfolio/${project.slug}`}>
            View Project <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
