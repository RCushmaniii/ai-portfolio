import fs from 'fs';
import path from 'path';
import type { PortfolioProject, PortfolioData } from './types';
export { filterProjects, sortProjects, searchProjects } from './filters';

// Order configuration type
interface PortfolioOrderConfig {
  order: string[];
  featured: string[];
}

// Marketing overrides type
interface ProjectOverride {
  headline?: string;
  subheadline?: string;
  good_for?: string[];
  not_for?: string[];
  what_you_get?: string[];
}

// Load order config
const orderConfigPath = path.join(process.cwd(), 'content', 'portfolio-order.json');
let orderConfig: PortfolioOrderConfig = { order: [], featured: [] };
try {
  orderConfig = JSON.parse(fs.readFileSync(orderConfigPath, 'utf-8'));
} catch {
  // No order config, use defaults
}

// Load project overrides
const overridesPath = path.join(process.cwd(), 'content', 'project-overrides.json');
let projectOverrides: Record<string, ProjectOverride> = {};
try {
  projectOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf-8'));
} catch {
  // No overrides, use defaults
}

// Load portfolio data at build time
const portfolioPath = path.join(process.cwd(), 'content', 'portfolio.json');
let portfolioData: PortfolioData;

try {
  const rawData = JSON.parse(fs.readFileSync(portfolioPath, 'utf-8'));
  const projects = (rawData.projects as PortfolioProject[]).map((p) => {
    const overrides = projectOverrides[p.slug] || {};
    const thumbnailFallback = `https://opengraph.githubassets.com/1/RCushmaniii/${p.repo_name}`;

    return {
      ...p,
      // Order config is the source of truth for featured status
      portfolio_featured: orderConfig.featured.length > 0
        ? orderConfig.featured.includes(p.slug)
        : p.portfolio_featured,
      // Compute thumbnail fallback from GitHub OpenGraph
      thumbnail_fallback: thumbnailFallback,
      // Use fallback when no thumbnail is set
      thumbnail: p.thumbnail || thumbnailFallback,
      // Merge marketing overrides
      ...overrides,
    };
  });
  portfolioData = {
    generated_at: rawData.generated_at,
    projects,
  };
} catch {
  portfolioData = { generated_at: '', projects: [] };
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return portfolioData.projects.filter((p) => p.portfolio_enabled);
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  return portfolioData.projects.find((p) => p.slug === slug && p.portfolio_enabled);
}
