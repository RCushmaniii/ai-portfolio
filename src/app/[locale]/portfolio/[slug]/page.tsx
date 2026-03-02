import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPortfolioProjects, getProjectBySlug } from '@/lib/portfolio/loader';
import { PortfolioDetail } from '@/components/portfolio/PortfolioDetail';
import { JsonLd } from '@/components/JsonLd';
import { isValidLocale, LOCALES, t, type Locale } from '@/i18n';

const BASE_URL = 'https://ai-portfolio-cushlabs.vercel.app';

const SOFTWARE_CATEGORIES = new Set([
  'AI Automation',
  'Tools',
  'Developer Tools',
  'Templates',
]);

function getProjectJsonLd(project: Awaited<ReturnType<typeof getProjectBySlug>>) {
  if (!project) return null;
  const isSoftware = SOFTWARE_CATEGORIES.has(project.category);
  return {
    '@context': 'https://schema.org',
    '@type': isSoftware ? 'SoftwareApplication' : 'CreativeWork',
    name: project.title,
    description: project.tagline,
    url: `${BASE_URL}/portfolio/${project.slug}`,
    ...(project.thumbnail ? { image: project.thumbnail } : {}),
    applicationCategory: project.category,
    author: {
      '@type': 'Person',
      name: 'Robert Cushman',
    },
    ...(isSoftware && project.live_url ? { installUrl: project.live_url } : {}),
  };
}

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
      siteName: 'CUSHLABS',
      url: locale === 'es' ? `${BASE_URL}/es/portfolio/${project.slug}` : `${BASE_URL}/portfolio/${project.slug}`,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.tagline,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
    alternates: {
      canonical: locale === 'es'
        ? `${BASE_URL}/es/portfolio/${slug}`
        : `${BASE_URL}/portfolio/${slug}`,
      languages: {
        en: `${BASE_URL}/portfolio/${slug}`,
        es: `${BASE_URL}/es/portfolio/${slug}`,
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

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'es' ? 'Inicio' : 'Home',
        item: locale === 'es' ? `${BASE_URL}/es` : BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: locale === 'es' ? `${BASE_URL}/es/portfolio` : `${BASE_URL}/portfolio`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: locale === 'es'
          ? `${BASE_URL}/es/portfolio/${project.slug}`
          : `${BASE_URL}/portfolio/${project.slug}`,
      },
    ],
  };

  const projectLd = getProjectJsonLd(project);

  return (
    <div className="container py-8">
      <JsonLd data={breadcrumbLd} />
      {projectLd && <JsonLd data={projectLd} />}
      <PortfolioDetail project={project} locale={locale} />
    </div>
  );
}
