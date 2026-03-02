import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { isValidLocale, LOCALES, t, type Locale } from '@/i18n';

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
    metadataBase: new URL('https://ai-portfolio-cushlabs.vercel.app'),
    title: {
      template: '%s | CushLabs',
      default: dict.meta_title,
    },
    description: dict.meta_description,
    openGraph: {
      siteName: 'CushLabs',
      type: 'website',
    },
    alternates: {
      languages: {
        en: 'https://ai-portfolio-cushlabs.vercel.app',
        es: 'https://ai-portfolio-cushlabs.vercel.app/es',
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
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
