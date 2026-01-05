import { z } from 'zod';

export const PortfolioFrontmatterSchema = z.object({
  portfolio_enabled: z.boolean(),
  portfolio_priority: z.number().min(1).max(10),
  portfolio_featured: z.boolean().optional().default(false),
  portfolio_last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1).max(100),
  tagline: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(['AI Automation', 'Templates', 'Tools', 'Client Work']),
  target_audience: z.string().max(100).default(''),
  tags: z.array(z.string()).max(10).default([]),
  thumbnail: z.string().url().or(z.literal('')).default(''),
  hero_images: z.array(z.string().url()).max(10).default([]),
  demo_video_url: z.string().url().or(z.literal('')).optional().default(''),
  live_url: z.string().url().or(z.literal('')).default(''),
  case_study_url: z.string().url().or(z.literal('')).optional().default(''),
  problem_solved: z.string().max(500).default(''),
  key_outcomes: z.array(z.string()).max(10).default([]),
  tech_stack: z.array(z.string()).max(20).default([]),
  complexity: z.enum(['MVP', 'Production', 'Enterprise']).default('Production'),
});

export type PortfolioFrontmatter = z.infer<typeof PortfolioFrontmatterSchema>;
