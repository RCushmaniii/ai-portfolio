import { z } from 'zod';

// Accepts full URLs, local paths (/images/...), or empty string
const imagePathOrUrl = z.string().refine(
  (val) => val === '' || val.startsWith('/') || /^https?:\/\//.test(val),
  'Must be a URL, a local path starting with /, or empty'
);

const CATEGORIES = [
  'AI Automation',
  'Templates',
  'Tools',
  'Developer Tools',
  'Client Work',
  'Games',
  'Marketing',
  'Creative',
] as const;

// Schema that accepts both old and new field names for backward compatibility
const RawFrontmatterSchema = z.object({
  // Control flags
  portfolio_enabled: z.boolean(),
  portfolio_priority: z.number().min(1).max(10),
  portfolio_featured: z.boolean().optional().default(false),
  portfolio_last_reviewed: z.string().optional(),

  // Card display
  title: z.string().min(1).max(100),
  tagline: z.string().min(1).max(300),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(CATEGORIES),
  tech_stack: z.array(z.string()).min(1).max(20),
  thumbnail: imagePathOrUrl.default(''),
  thumbnail_url: imagePathOrUrl.optional(), // Legacy alias

  // Status (new) or complexity (legacy)
  status: z.enum(['Production', 'MVP', 'Demo', 'Archived']).optional(),
  complexity: z.enum(['MVP', 'Production', 'Enterprise']).optional(), // Legacy

  // Detail page - new fields
  problem: z.string().max(2000).optional(),
  solution: z.string().max(2000).optional(),
  key_features: z.array(z.string()).max(10).optional(),
  metrics: z.array(z.string()).max(6).optional(),

  // Detail page - legacy fields
  problem_solved: z.string().max(2000).optional(),
  key_outcomes: z.array(z.string()).max(10).optional(),
  target_audience: z.string().optional(),

  // Links
  demo_url: z.string().url().or(z.literal('')).optional(),
  live_url: z.string().url().or(z.literal('')).optional(),
  case_study_url: z.string().optional(),
  demo_video_url: imagePathOrUrl.optional(),

  // Optional extras
  hero_images: z.array(imagePathOrUrl).max(10).default([]),
  hero_image_urls: z.array(imagePathOrUrl).optional(), // Legacy alias
  tags: z.array(z.string()).max(10).default([]),
  date_completed: z.string().optional(),
});

// Transform to normalize old field names to new ones
export const PortfolioFrontmatterSchema = RawFrontmatterSchema.transform((data) => ({
  portfolio_enabled: data.portfolio_enabled,
  portfolio_priority: data.portfolio_priority,
  portfolio_featured: data.portfolio_featured ?? false,
  title: data.title,
  tagline: data.tagline,
  slug: data.slug,
  category: data.category,
  tech_stack: data.tech_stack,
  thumbnail: data.thumbnail || data.thumbnail_url || '',
  status: data.status || (data.complexity === 'Enterprise' ? 'Production' : data.complexity) || 'Production',
  problem: data.problem || data.problem_solved || '',
  solution: data.solution || '',
  key_features: data.key_features || data.key_outcomes || [],
  metrics: data.metrics || [],
  demo_url: data.demo_url || '',
  live_url: data.live_url || '',
  demo_video_url: data.demo_video_url || '',
  hero_images: data.hero_images.length > 0 ? data.hero_images : (data.hero_image_urls || []),
  tags: data.tags,
  date_completed: data.date_completed,
}));

export type PortfolioFrontmatter = z.infer<typeof PortfolioFrontmatterSchema>;
