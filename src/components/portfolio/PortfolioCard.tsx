'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { t, getLocalizedPath, type Locale } from '@/i18n';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface PortfolioCardProps {
  project: PortfolioProject;
  locale: Locale;
}

export const PortfolioCard = memo(function PortfolioCard({ project, locale }: PortfolioCardProps) {
  const dict = t(locale);
  const [imgError, setImgError] = useState(false);
  const imageSrc = project.thumbnail || project.thumbnail_fallback;
  const showImage = imageSrc && !imgError;

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Thumbnail — clickable link to project */}
      <Link href={getLocalizedPath(`/portfolio/${project.slug}`, locale)} className="relative aspect-video overflow-hidden bg-muted block">
        {showImage ? (
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-4xl font-bold text-primary/40">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {project.portfolio_featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
            {dict.card_featured}
          </Badge>
        )}
      </Link>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline">{project.category}</Badge>
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
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={getLocalizedPath(`/portfolio/${project.slug}`, locale)}>
            {dict.card_view_project} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
