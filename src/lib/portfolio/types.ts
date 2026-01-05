export type PortfolioCategory = 'AI Automation' | 'Templates' | 'Tools' | 'Client Work';
export type ProjectComplexity = 'MVP' | 'Production' | 'Enterprise';
export type SortOption = 'priority' | 'recent' | 'popular';

export interface PortfolioProject {
  // From PORTFOLIO.md frontmatter
  portfolio_enabled: boolean;
  portfolio_priority: number;
  portfolio_featured: boolean;
  portfolio_last_reviewed: string;
  title: string;
  tagline: string;
  slug: string;
  category: PortfolioCategory;
  target_audience: string;
  tags: string[];
  thumbnail: string;
  hero_images: string[];
  demo_video_url: string;
  live_url: string;
  case_study_url: string;
  problem_solved: string;
  key_outcomes: string[];
  tech_stack: string[];
  complexity: ProjectComplexity;

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
  category: PortfolioCategory | 'all';
  sort: SortOption;
}
