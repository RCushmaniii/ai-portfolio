import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageCarousel } from './ImageCarousel';
import { ArrowLeft, ExternalLink, Github, Star, Check } from 'lucide-react';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface PortfolioDetailProps {
  project: PortfolioProject;
}

export function PortfolioDetail({ project }: PortfolioDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link & External Links */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Link>
        </Button>
        <div className="flex gap-2">
          {project.demo_url && (
            <Button asChild>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                Try Demo <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          {project.live_url && !project.demo_url && (
            <Button asChild>
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                View Live <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          {project.live_url && project.demo_url && (
            <Button variant="secondary" asChild>
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                Production <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </a>
          </Button>
        </div>
      </div>

      {/* Hero Carousel */}
      <ImageCarousel images={project.hero_images} title={project.title} />

      {/* Header */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge>{project.category}</Badge>
          <Badge variant="outline">{project.status}</Badge>
          {project.github_stars > 0 && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-current" />
              {project.github_stars}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{project.tagline}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
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
          <ReactMarkdown>{project.body_markdown}</ReactMarkdown>
        </section>
      )}

      {/* CTA */}
      <section className="mt-12 p-6 bg-muted rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">Ready to discuss a similar solution?</h2>
        <p className="text-muted-foreground mb-4">
          Let&apos;s explore how AI automation can help your business.
        </p>
        <Button size="lg" asChild>
          <a href="https://cushlabs.ai/contact">Schedule a Consultation</a>
        </Button>
      </section>
    </div>
  );
}
