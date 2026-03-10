import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ScrollToTop } from '@/components/ScrollToTop';
import { JsonLd } from '@/components/JsonLd';
import { isValidLocale, LOCALES, t, type Locale } from '@/i18n';

const BASE_URL = 'https://ai-portfolio-cushlabs.vercel.app';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = t(locale);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: '%s | CUSHLABS',
      default: dict.meta_title,
    },
    description: dict.meta_description,
    openGraph: {
      siteName: 'CUSHLABS',
      type: 'website',
    },
    alternates: {
      canonical: locale === 'es' ? `${BASE_URL}/es` : BASE_URL,
      languages: {
        en: BASE_URL,
        es: `${BASE_URL}/es`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'CushLabs AI Services',
          url: 'https://ai-portfolio-cushlabs.vercel.app',
          logo: 'https://ai-portfolio-cushlabs.vercel.app/favicon.svg',
          founder: {
            '@type': 'Person',
            name: 'Robert Cushman',
            jobTitle: 'Business Solution Architect & Full-Stack Developer',
          },
          sameAs: [
            'https://github.com/RCushmaniii',
            'https://linkedin.com/in/robertcushman',
          ],
        }}
      />
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
      <ScrollToTop />
    </>
  );
}
