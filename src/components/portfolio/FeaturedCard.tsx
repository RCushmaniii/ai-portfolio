'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { t, getLocalizedPath, type Locale } from '@/i18n';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface FeaturedCardProps {
  project: PortfolioProject;
  locale: Locale;
}

export const FeaturedCard = memo(function FeaturedCard({ project, locale }: FeaturedCardProps) {
  const dict = t(locale);
  const [imgError, setImgError] = useState(false);
  const imageSrc = project.thumbnail || project.thumbnail_fallback;
  const showImage = imageSrc && !imgError;

  return (
    <Link
      href={getLocalizedPath(`/portfolio/${project.slug}`, locale)}
      className="group block rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-cush-orange/40"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-2/5 aspect-video md:aspect-auto overflow-hidden bg-muted">
          {showImage ? (
            <Image
              src={imageSrc}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gradient-to-br from-cush-orange/20 to-cush-orange/5">
              <span className="text-5xl font-bold text-cush-orange/40">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {project.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {project.status}
              </Badge>
            </div>
            <h3 className="text-xl font-bold transition-colors group-hover:text-cush-orange">
              {project.headline || project.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {project.subheadline || project.tagline}
            </p>
          </div>

          {/* Problem / Solution */}
          {(project.problem || project.solution) && (
            <div className="grid sm:grid-cols-2 gap-3">
              {project.problem && (
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wider">
                      {dict.featured_card_problem}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {project.problem}
                    </p>
                  </div>
                </div>
              )}
              {project.solution && (
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-green-500 uppercase tracking-wider">
                      {dict.featured_card_solution}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {project.solution}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Outcomes (metrics) */}
          {project.metrics.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {dict.featured_card_outcomes}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.metrics.slice(0, 4).map((metric) => (
                  <Badge key={metric} variant="secondary" className="text-xs">
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tech stack + CTA */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-1">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs text-muted-foreground">
                  {tech}
                </Badge>
              ))}
              {project.tech_stack.length > 4 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{project.tech_stack.length - 4}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-cush-orange hover:text-cush-orange shrink-0"
              tabIndex={-1}
            >
              {dict.featured_card_learn_more}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
});
