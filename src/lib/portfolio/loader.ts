import fs from 'fs';
import path from 'path';
import type { PortfolioProject, PortfolioData } from './types';
export { filterProjects, sortProjects, searchProjects } from './filters';

const GITHUB_OWNER = 'RCushmaniii';
const SELF_REPO = 'ai-portfolio'; // This app's own repo — local paths stay relative
const CDN_BASE = 'https://cdn.cushlabs.ai'; // Cloudflare R2 CDN for all portfolio assets

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
 * Mirrors the CushLabs Astro site's resolveAssetUrl exactly:
 * - Already absolute URLs (https://) pass through as-is
 * - Self-repo paths stay relative (served from this app's public/)
 * - All other repos resolve to Cloudflare R2 CDN: cdn.cushlabs.ai/{repo}/{path}
 */
function resolveAssetUrl(
  assetPath: string | undefined | null,
  repoName: string,
): string | null {
  if (!assetPath) return null;
  // Already an absolute URL
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  // Self-repo: assets live in this app's own public/ dir, keep paths relative
  if (repoName === SELF_REPO) return assetPath;
  // Strip accidental /public/ prefix (common PORTFOLIO.md mistake)
  const cleaned = assetPath.replace(/^\/public\//, '/');
  // Normalize: ensure path starts with /
  const normalizedPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  // All external repo assets are served from Cloudflare R2 CDN
  return `${CDN_BASE}/${repoName}${normalizedPath}`;
}

// Load order config
const orderConfigPath = path.join(process.cwd(), 'content', 'portfolio-order.json');
let orderConfig: PortfolioOrderConfig = { order: [], featured: [] };
try {
  orderConfig = JSON.parse(fs.readFileSync(orderConfigPath, 'utf-8'));
} catch (err) {
  console.warn('[portfolio] Failed to load portfolio-order.json:', err instanceof Error ? err.message : err);
}

// Load project overrides
const overridesPath = path.join(process.cwd(), 'content', 'project-overrides.json');
let projectOverrides: Record<string, ProjectOverride> = {};
try {
  projectOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf-8'));
} catch (err) {
  console.warn('[portfolio] Failed to load project-overrides.json:', err instanceof Error ? err.message : err);
}

// Load portfolio data at build time
const portfolioPath = path.join(process.cwd(), 'content', 'portfolio.json');
let portfolioData: PortfolioData;

try {
  const rawData = JSON.parse(fs.readFileSync(portfolioPath, 'utf-8'));
  const projects = (rawData.projects as PortfolioProject[]).map((p) => {
    const overrides = projectOverrides[p.slug] || {};
    const thumbnailFallback = `https://opengraph.githubassets.com/1/${GITHUB_OWNER}/${p.repo_name}`;

    // Resolve thumbnail: override takes priority, then PORTFOLIO.md value
    // Override thumbnails are local to this app (SELF_REPO), not the project's deploy
    const resolvedThumbnail = overrides.thumbnail
      ? resolveAssetUrl(overrides.thumbnail, SELF_REPO)
      : resolveAssetUrl(p.thumbnail, p.repo_name);

    // Resolve hero images
    const resolvedHeroImages = p.hero_images
      .map((img) => resolveAssetUrl(img, p.repo_name))
      .filter((url): url is string => url !== null);

    // Resolve video URL and poster — overrides are local to this app
    const videoUrl = overrides.video_url
      ? resolveAssetUrl(overrides.video_url, SELF_REPO) || ''
      : resolveAssetUrl(p.demo_video_url || '', p.repo_name) || '';
    const videoPoster = overrides.video_poster
      ? resolveAssetUrl(overrides.video_poster, SELF_REPO) || ''
      : resolveAssetUrl(p.video_poster || '', p.repo_name) || '';

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
} catch (err) {
  console.warn('[portfolio] Failed to load portfolio.json — site will render with 0 projects:', err instanceof Error ? err.message : err);
  portfolioData = { generated_at: '', projects: [] };
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return portfolioData.projects.filter((p) => p.portfolio_enabled);
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  return portfolioData.projects.find((p) => p.slug === slug && p.portfolio_enabled);
}
