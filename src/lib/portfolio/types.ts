export type PortfolioCategory = 'AI Automation' | 'Templates' | 'Tools' | 'Client Work';
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
  status: ProjectStatus;

  // Detail page
  problem: string;
  solution: string;
  key_features: string[];
  metrics: string[];

  // Links
  demo_url: string;
  live_url: string;

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

// Backward compatibility - these fields may exist in old portfolio.json files
export interface LegacyPortfolioProject extends Omit<PortfolioProject, 'status' | 'problem' | 'solution' | 'key_features' | 'metrics' | 'demo_url'> {
  complexity?: 'MVP' | 'Production' | 'Enterprise';
  problem_solved?: string;
  key_outcomes?: string[];
  target_audience?: string;
  case_study_url?: string;
  demo_video_url?: string;
  portfolio_last_reviewed?: string;
}

export interface PortfolioData {
  generated_at: string;
  projects: PortfolioProject[];
}

export interface PortfolioFilters {
  category: PortfolioCategory | 'all';
  sort: SortOption;
}
