import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { t, getLocalizedPath, type Locale } from "@/i18n";
import type { PortfolioProject } from "@/lib/portfolio/types";

interface FeaturedWorkProps {
  projects: PortfolioProject[];
  locale: Locale;
}

const FEATURED_LIMIT = 9;

export function FeaturedWork({ projects, locale }: FeaturedWorkProps) {
  const dict = t(locale);
  const featured = projects
    .filter((p) => p.portfolio_featured)
    .slice(0, FEATURED_LIMIT);

  if (featured.length === 0) return null;

  return (
    <section className="container py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">{dict.featured_title}</h2>
        <p className="text-muted-foreground">{dict.featured_subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href={getLocalizedPath("/portfolio", locale)}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          {dict.featured_view_all} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
