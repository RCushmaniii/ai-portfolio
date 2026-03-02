import type { MetadataRoute } from 'next';
import { getPortfolioProjects } from '@/lib/portfolio/loader';

const BASE_URL = 'https://ai-portfolio-cushlabs.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPortfolioProjects();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: BASE_URL,
          es: `${BASE_URL}/es`,
        },
      },
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${BASE_URL}/portfolio`,
          es: `${BASE_URL}/es/portfolio`,
        },
      },
    },
    {
      url: `${BASE_URL}/featured`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/featured`,
          es: `${BASE_URL}/es/featured`,
        },
      },
    },
  ];

  // Dynamic project pages
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/portfolio/${project.slug}`,
    lastModified: project.github_updated_at
      ? new Date(project.github_updated_at)
      : new Date(),
    changeFrequency: 'monthly' as const,
    priority: project.portfolio_featured ? 0.8 : 0.6,
    alternates: {
      languages: {
        en: `${BASE_URL}/portfolio/${project.slug}`,
        es: `${BASE_URL}/es/portfolio/${project.slug}`,
      },
    },
  }));

  return [...staticPages, ...projectPages];
}
