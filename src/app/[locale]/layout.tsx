import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { JsonLd } from "@/components/JsonLd";
import { isValidLocale, LOCALES, t, type Locale } from "@/i18n";
import "../globals.css";

const BASE_URL = "https://ai-portfolio-cushlabs.vercel.app";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = t(locale);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: "%s | CUSHLABS",
      default: dict.meta_title,
    },
    description: dict.meta_description,
    openGraph: {
      siteName: "CUSHLABS",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "CushLabs AI Services — AI That Works While You Sleep",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: locale === "es" ? `${BASE_URL}/es` : BASE_URL,
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "CushLabs AI Services",
                url: "https://ai-portfolio-cushlabs.vercel.app",
                logo: "https://ai-portfolio-cushlabs.vercel.app/favicon.svg",
                founder: {
                  "@type": "Person",
                  name: "Robert Cushman",
                  jobTitle:
                    "Business Solution Architect & Full-Stack Developer",
                },
                sameAs: [
                  "https://github.com/RCushmaniii",
                  "https://linkedin.com/in/robertcushman",
                ],
              }}
            />
            <SiteHeader locale={locale} />
            <main className="flex-1">{children}</main>
            <SiteFooter locale={locale} />
            <ScrollToTop />
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
