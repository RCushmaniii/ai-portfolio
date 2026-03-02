import fs from 'fs';
import path from 'path';
import type { PortfolioProject, PortfolioData } from './types';
export { filterProjects, sortProjects, searchProjects } from './filters';

const GITHUB_OWNER = 'RCushmaniii';
const SELF_REPO = 'ai-portfolio'; // This app's own repo — local paths stay relative

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
  thumbnail?: string;
  video_url?: string;
  video_poster?: string;
}

/**
 * Resolve a relative asset path to an absolute URL.
 * Same pattern as the CushLabs Astro site's resolveAssetUrl.
 * - Already absolute URLs (https://) pass through as-is
 * - Relative paths: resolve against deploy URL (live_url or demo_url)
 * - Fallback: raw.githubusercontent.com
 */
function resolveAssetUrl(
  assetPath: string | undefined | null,
  repoName: string,
  deployUrl: string | null
): string | null {
  if (!assetPath) return null;
  // Already an absolute URL
  if (assetPath.startsWith('https://') || assetPath.startsWith('http://')) return assetPath;
  // Strip accidental /public prefix (some PORTFOLIO.md files have this wrong)
  const cleanPath = assetPath.startsWith('/public/')
    ? assetPath.replace('/public', '')
    : assetPath;
  // Self-repo: assets live in this app's own public/ dir, keep paths relative
  if (repoName === SELF_REPO) return cleanPath;
  // Resolve against deploy URL if available
  if (deployUrl) {
    const base = deployUrl.replace(/\/+$/, '');
    return `${base}${cleanPath}`;
  }
  // Fallback to raw.githubusercontent.com
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${repoName}/main/public${cleanPath}`;
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
    const thumbnailFallback = `https://opengraph.githubassets.com/1/${GITHUB_OWNER}/${p.repo_name}`;

    // Use live_url or demo_url as the deploy URL for asset resolution
    const deployUrl = p.live_url || p.demo_url || null;

    // Resolve thumbnail: override takes priority, then PORTFOLIO.md value
    const thumbnailSource = overrides.thumbnail || p.thumbnail;
    const resolvedThumbnail = resolveAssetUrl(thumbnailSource, p.repo_name, deployUrl);

    // Resolve hero images
    const resolvedHeroImages = p.hero_images
      .map((img) => resolveAssetUrl(img, p.repo_name, deployUrl))
      .filter((url): url is string => url !== null);

    // Resolve video URL and poster from overrides
    const rawVideoUrl = overrides.video_url || p.demo_video_url || '';
    const videoUrl = resolveAssetUrl(rawVideoUrl, p.repo_name, deployUrl) || '';
    const rawPoster = overrides.video_poster || p.video_poster || '';
    const videoPoster = resolveAssetUrl(rawPoster, p.repo_name, deployUrl) || '';

    return {
      ...p,
      // Order config is the source of truth for featured status
      portfolio_featured: orderConfig.featured.length > 0
        ? orderConfig.featured.includes(p.slug)
        : p.portfolio_featured,
      // Compute thumbnail fallback from GitHub OpenGraph
      thumbnail_fallback: thumbnailFallback,
      // Resolved thumbnail with fallback chain
      thumbnail: resolvedThumbnail || thumbnailFallback,
      // Resolved hero images
      hero_images: resolvedHeroImages,
      // Video fields
      video_url: videoUrl,
      video_poster: videoPoster,
      // Merge marketing overrides (excluding video fields already handled)
      headline: overrides.headline,
      subheadline: overrides.subheadline,
      good_for: overrides.good_for,
      not_for: overrides.not_for,
      what_you_get: overrides.what_you_get,
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
