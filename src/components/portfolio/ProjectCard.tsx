"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { t, getLocalizedPath, type Locale } from "@/i18n";
import type { PortfolioProject } from "@/lib/portfolio/types";

interface ProjectCardProps {
  project: PortfolioProject;
  locale: Locale;
  /** Show the "Featured" ribbon overlay. Useful on mixed grids; omit on
   *  all-featured contexts (e.g. the home page) where it would be redundant. */
  showFeaturedBadge?: boolean;
}

/**
 * Shared project card used by both the home "Featured Work" grid and the
 * full /portfolio grid, so the two surfaces share one consistent design.
 */
export const ProjectCard = memo(function ProjectCard({
  project,
  locale,
  showFeaturedBadge = false,
}: ProjectCardProps) {
  const dict = t(locale);
  const [imgError, setImgError] = useState(false);
  const imageSrc = project.thumbnail || project.thumbnail_fallback;
  const showImage = imageSrc && !imgError;

  return (
    <Link
      href={getLocalizedPath(`/portfolio/${project.slug}`, locale)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
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
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-4xl font-bold text-primary/40">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {showFeaturedBadge && project.portfolio_featured && (
          <Badge className="absolute left-2 top-2 bg-yellow-500 hover:bg-yellow-600">
            {dict.card_featured}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {project.category}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {project.status}
          </Badge>
        </div>
        <h3 className="mb-1 line-clamp-1 font-semibold">
          {project.headline || project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {project.subheadline || project.tagline}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary transition-all group-hover:gap-2">
          {dict.card_view_project} <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
});
