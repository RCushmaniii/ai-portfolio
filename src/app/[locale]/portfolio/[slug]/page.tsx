import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPortfolioProjects, getProjectBySlug } from '@/lib/portfolio/loader';
import { PortfolioDetail } from '@/components/portfolio/PortfolioDetail';
import { isValidLocale, LOCALES, t, type Locale } from '@/i18n';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPortfolioProjects();
  return LOCALES.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
  const dict = t(locale);
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: dict.meta_not_found };
  }

  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      type: 'article',
      siteName: 'CushLabs',
      url: locale === 'es' ? `/es/portfolio/${project.slug}` : `/portfolio/${project.slug}`,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.tagline,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
    alternates: {
      languages: {
        en: `https://cushlabs.ai/portfolio/${slug}`,
        es: `https://cushlabs.ai/es/portfolio/${slug}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-8">
      <PortfolioDetail project={project} locale={locale} />
    </div>
  );
}
