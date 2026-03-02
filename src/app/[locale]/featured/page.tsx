import { getPortfolioProjects } from '@/lib/portfolio/loader';
import { FeaturedShowcase } from '@/components/portfolio/FeaturedShowcase';
import { isValidLocale, t, type Locale } from '@/i18n';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
  const dict = t(locale);

  return {
    title: dict.featured_page_title,
    description: dict.featured_page_subtitle,
    alternates: {
      languages: {
        en: 'https://ai-portfolio-cushlabs.vercel.app/featured',
        es: 'https://ai-portfolio-cushlabs.vercel.app/es/featured',
      },
    },
  };
}

export default async function FeaturedPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
  const dict = t(locale);
  const projects = await getPortfolioProjects();
  const featured = projects.filter((p) => p.portfolio_featured);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{dict.featured_page_title}</h1>
        <p className="text-muted-foreground">{dict.featured_page_subtitle}</p>
      </div>

      <FeaturedShowcase projects={featured} locale={locale} />
    </div>
  );
}
