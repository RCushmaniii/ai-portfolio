import fs from 'fs';
import path from 'path';
import type { PortfolioProject, PortfolioData } from './types';
export { filterProjects, sortProjects } from './filters';

// Order configuration type
interface PortfolioOrderConfig {
  order: string[];
  featured: string[];
}

// Load order config
const orderConfigPath = path.join(process.cwd(), 'content', 'portfolio-order.json');
let orderConfig: PortfolioOrderConfig = { order: [], featured: [] };
try {
  orderConfig = JSON.parse(fs.readFileSync(orderConfigPath, 'utf-8'));
} catch {
  // No order config, use defaults
}

// Load portfolio data at build time
const portfolioPath = path.join(process.cwd(), 'content', 'portfolio.json');
let portfolioData: PortfolioData;

try {
  const rawData = JSON.parse(fs.readFileSync(portfolioPath, 'utf-8'));
  const projects = (rawData.projects as PortfolioProject[]).map((p) => ({
    ...p,
    // Order config is the source of truth for featured status
    portfolio_featured: orderConfig.featured.length > 0
      ? orderConfig.featured.includes(p.slug)
      : p.portfolio_featured,
  }));
  portfolioData = {
    generated_at: rawData.generated_at,
    projects,
  };
} catch {
  portfolioData = { generated_at: '', projects: [] };
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return portfolioData.projects;
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  return portfolioData.projects.find((p) => p.slug === slug);
}
