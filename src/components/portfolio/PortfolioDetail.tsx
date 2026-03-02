import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageCarousel } from './ImageCarousel';
import { Breadcrumb } from './Breadcrumb';
import { HighlightBoxes } from './HighlightBoxes';
import { ProjectSidebar } from './ProjectSidebar';
import { ProjectAside } from './ProjectAside';
import { Check } from 'lucide-react';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface PortfolioDetailProps {
  project: PortfolioProject;
}

export function PortfolioDetail({ project }: PortfolioDetailProps) {
  const displayTitle = project.headline || project.title;
  const displaySubtitle = project.subheadline || project.tagline;

  return (
    <div>
      <Breadcrumb projectTitle={project.title} />

      {/* 3-column layout: sidebar | main | aside */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-8">
        {/* Left sidebar — sticky on desktop, inline on mobile */}
        <div className="order-2 lg:order-1">
          <div className="lg:sticky lg:top-20">
            <ProjectSidebar project={project} />
          </div>
        </div>

        {/* Main content */}
        <div className="order-1 lg:order-2 min-w-0">
          {/* Hero Carousel */}
          <ImageCarousel images={project.hero_images} title={project.title} />

          {/* Header */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge>{project.category}</Badge>
              <Badge variant="outline">{project.status}</Badge>
              {project.portfolio_featured && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{displayTitle}</h1>
            <p className="text-xl text-muted-foreground mb-6">{displaySubtitle}</p>
          </div>

          {/* Highlight Boxes */}
          <div className="mb-8">
            <HighlightBoxes project={project} />
          </div>

          {/* Mobile-only: Tech stack (shown inline before content on small screens) */}
          <div className="lg:hidden mb-8">
            <ProjectAside project={project} />
          </div>

          {/* Problem & Solution */}
          {(project.problem || project.solution) && (
            <section className="mb-8 grid md:grid-cols-2 gap-6">
              {project.problem && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">The Problem</h2>
                  <p className="text-muted-foreground">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">The Solution</h2>
                  <p className="text-muted-foreground">{project.solution}</p>
                </div>
              )}
            </section>
          )}

          {/* Key Features */}
          {project.key_features.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Key Features</h2>
              <ul className="space-y-2">
                {project.key_features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Metrics */}
          {project.metrics.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Results</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.metrics.map((metric, i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg text-center">
                    <span className="font-semibold">{metric}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Markdown Body */}
          {project.body_markdown && (
            <section className="mb-8 prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown
                allowedElements={[
                  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                  'p', 'br', 'hr',
                  'ul', 'ol', 'li',
                  'strong', 'em', 'del',
                  'a', 'code', 'pre',
                  'blockquote',
                  'table', 'thead', 'tbody', 'tr', 'th', 'td',
                ]}
              >
                {project.body_markdown}
              </ReactMarkdown>
            </section>
          )}

          {/* CTA */}
          <section className="mt-12 p-6 bg-muted rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Ready to discuss a similar solution?</h2>
            <p className="text-muted-foreground mb-4">
              Let&apos;s explore how AI automation can help your business.
            </p>
            <Button size="lg" asChild>
              <a href="https://cushlabs.ai/contact" rel="noopener noreferrer">
                Schedule a Consultation
              </a>
            </Button>
          </section>
        </div>

        {/* Right aside — sticky on desktop, hidden on mobile (shown inline above) */}
        <div className="hidden lg:block order-3">
          <div className="lg:sticky lg:top-20">
            <ProjectAside project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}
