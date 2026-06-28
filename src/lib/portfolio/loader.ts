import fs from "fs";
import path from "path";
import type { PortfolioProject, PortfolioData, HeroImage } from "./types";
export { filterProjects, sortProjects, searchProjects } from "./filters";

const SELF_REPO = "ai-portfolio"; // This app's own repo — local paths stay relative
const CDN_BASE = "https://cdn.cushlabs.ai"; // Cloudflare R2 CDN for all portfolio assets

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
  const cleaned = assetPath.replace(/^\/public\//, "/");
  // Normalize: ensure path starts with /
  const normalizedPath = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  // All external repo assets are served from Cloudflare R2 CDN
  return `${CDN_BASE}/${repoName}${normalizedPath}`;
}

// Branded fallback card shown when a thumbnail is missing or off-allowlist.
// Matches the cushlabs site's default-card.svg.
const BRANDED_FALLBACK = "/images/portfolio/default-card.svg";

// Accept a resolved thumbnail only if it is a local /images/ path or an R2 CDN
// URL; otherwise return the branded card. Prevents emitting any URL that could
// 404 (e.g. a private-repo GitHub OpenGraph card).
function thumbnailOrBranded(url: string | null): string {
  if (url && (url.startsWith("/images/") || url.startsWith(`${CDN_BASE}/`))) {
    return url;
  }
  return BRANDED_FALLBACK;
}

// Load order config
const orderConfigPath = path.join(
  process.cwd(),
  "content",
  "portfolio-order.json",
);
let orderConfig: PortfolioOrderConfig = { order: [], featured: [] };
try {
  orderConfig = JSON.parse(fs.readFileSync(orderConfigPath, "utf-8"));
} catch (err) {
  console.warn(
    "[portfolio] Failed to load portfolio-order.json:",
    err instanceof Error ? err.message : err,
  );
}

// Load project overrides
const overridesPath = path.join(
  process.cwd(),
  "content",
  "project-overrides.json",
);
let projectOverrides: Record<string, ProjectOverride> = {};
try {
  projectOverrides = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
} catch (err) {
  console.warn(
    "[portfolio] Failed to load project-overrides.json:",
    err instanceof Error ? err.message : err,
  );
}

// Load portfolio data at build time
const portfolioPath = path.join(process.cwd(), "content", "portfolio.json");
let portfolioData: PortfolioData;

try {
  const rawData = JSON.parse(fs.readFileSync(portfolioPath, "utf-8"));
  const projects = (rawData.projects as PortfolioProject[]).map((p) => {
    const overrides = projectOverrides[p.slug] || {};

    // Resolve thumbnail: optional local override first, then the PORTFOLIO.md
    // value (which resolves to the Cloudflare R2 CDN for external repos —
    // matching the cushlabs site, the single canonical asset store).
    const resolvedThumbnail = overrides.thumbnail
      ? resolveAssetUrl(overrides.thumbnail, SELF_REPO)
      : resolveAssetUrl(p.thumbnail, p.repo_name);
    // Allowlist (mirrors cushlabs' getThumbnail): only emit a local /images/ path
    // or an R2 CDN URL. Anything else — or a missing thumbnail — degrades to the
    // branded card, so we never render a 404 or a private-repo GitHub gray card.
    const thumbnail = thumbnailOrBranded(resolvedThumbnail);

    // Resolve hero images — resolve each src while preserving bilingual alt text
    const resolvedHeroImages = p.hero_images
      .map((img): HeroImage | null => {
        const src = resolveAssetUrl(img.src, p.repo_name);
        return src ? { src, alt_en: img.alt_en, alt_es: img.alt_es } : null;
      })
      .filter((img): img is HeroImage => img !== null);

    // Resolve video URL and poster — overrides are local to this app
    const videoUrl = overrides.video_url
      ? resolveAssetUrl(overrides.video_url, SELF_REPO) || ""
      : resolveAssetUrl(p.demo_video_url || "", p.repo_name) || "";
    const videoPoster = overrides.video_poster
      ? resolveAssetUrl(overrides.video_poster, SELF_REPO) || ""
      : resolveAssetUrl(p.video_poster || "", p.repo_name) || "";

    return {
      ...p,
      // Order config is the source of truth for featured status
      portfolio_featured:
        orderConfig.featured.length > 0
          ? orderConfig.featured.includes(p.slug)
          : p.portfolio_featured,
      // Branded fallback card (used by the carousel when there are no images)
      thumbnail_fallback: BRANDED_FALLBACK,
      // Resolved thumbnail (R2 CDN / local), allowlisted with branded fallback
      thumbnail,
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
  console.warn(
    "[portfolio] Failed to load portfolio.json — site will render with 0 projects:",
    err instanceof Error ? err.message : err,
  );
  portfolioData = { generated_at: "", projects: [] };
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return portfolioData.projects.filter((p) => p.portfolio_enabled);
}

export async function getProjectBySlug(
  slug: string,
): Promise<PortfolioProject | undefined> {
  return portfolioData.projects.find(
    (p) => p.slug === slug && p.portfolio_enabled,
  );
}
