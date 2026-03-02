export type PortfolioCategory = 'AI Automation' | 'Templates' | 'Tools' | 'Developer Tools' | 'Client Work' | 'Games' | 'Marketing' | 'Creative';
export type ProjectStatus = 'Production' | 'MVP' | 'Demo' | 'Archived';
export type SortOption = 'priority' | 'recent' | 'popular';

export interface PortfolioProject {
  // Control flags
  portfolio_enabled: boolean;
  portfolio_priority: number;
  portfolio_featured: boolean;

  // Card display
  title: string;
  tagline: string;
  slug: string;
  category: PortfolioCategory;
  tech_stack: string[];
  thumbnail: string;
  thumbnail_fallback: string; // Computed by loader, not stored in JSON
  status: ProjectStatus;

  // Detail page
  problem: string;
  solution: string;
  key_features: string[];
  metrics: string[];

  // Marketing overrides (from project-overrides.json)
  headline?: string;
  subheadline?: string;
  good_for?: string[];
  not_for?: string[];
  what_you_get?: string[];

  // Links
  demo_url: string;
  live_url: string;
  demo_video_url: string;

  // Optional extras
  hero_images: string[];
  tags: string[];
  date_completed?: string;

  // From PORTFOLIO.md body
  body_markdown: string;

  // From GitHub API
  repo_name: string;
  repo_url: string;
  github_stars: number;
  github_forks: number;
  github_language: string | null;
  github_updated_at: string;
  github_description: string;
  github_topics: string[];
}

export interface PortfolioData {
  generated_at: string;
  projects: PortfolioProject[];
}

export interface PortfolioFilters {
  category: PortfolioCategory | 'all' | 'featured';
  sort: SortOption;
  search: string;
}
