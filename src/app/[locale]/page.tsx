import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FeaturedWork } from '@/components/portfolio/FeaturedWork';
import { getPortfolioProjects } from '@/lib/portfolio/loader';
import { isValidLocale, t, getLocalizedPath, type Locale } from '@/i18n';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
  const dict = t(locale);
  const projects = await getPortfolioProjects();

  return (
    <>
      <div className="container py-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{dict.home_title}</h1>
        <p className="text-xl text-muted-foreground mb-4">
          {dict.home_subtitle}
        </p>
        <p className="text-muted-foreground mb-8">
          {dict.home_description}
        </p>
        <Button size="lg" asChild>
          <Link href={getLocalizedPath('/portfolio', locale)}>{dict.home_cta}</Link>
        </Button>
      </div>

      <FeaturedWork projects={projects} locale={locale} />
    </>
  );
}
