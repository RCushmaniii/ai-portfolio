import { Suspense } from 'react';
import { getPortfolioProjects } from '@/lib/portfolio/loader';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { isValidLocale, t, interpolate, type Locale } from '@/i18n';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
  const dict = t(locale);

  return {
    title: dict.portfolio_title,
    description: dict.meta_portfolio_description,
    alternates: {
      languages: {
        en: 'https://ai-portfolio-cushlabs.vercel.app/portfolio',
        es: 'https://ai-portfolio-cushlabs.vercel.app/es/portfolio',
      },
    },
  };
}

function PortfolioGridSkeleton() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Skeleton className="h-10 w-full sm:w-96" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PortfolioPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
  const dict = t(locale);
  const projects = await getPortfolioProjects();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{dict.portfolio_title}</h1>
        <p className="text-muted-foreground">
          {interpolate(dict.portfolio_subtitle, { count: projects.length })}
        </p>
      </div>

      <Suspense fallback={<PortfolioGridSkeleton />}>
        <PortfolioGrid projects={projects} locale={locale} />
      </Suspense>
    </div>
  );
}
