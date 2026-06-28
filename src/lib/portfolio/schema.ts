import { z } from "zod";
import type { HeroImage } from "./types";

// Accepts full URLs, local paths (/images/...), or empty string. STRICT (errors on bad input).
const imagePathOrUrl = z
  .string()
  .refine(
    (val) => val === "" || val.startsWith("/") || /^https?:\/\//.test(val),
    "Must be a URL, a local path starting with /, or empty",
  );

// Lenient image field: coerces anything invalid (or non-string) to '' instead of failing.
// Used for optional cosmetic fields where a bad value should degrade to the fallback, not
// break the whole project's sync.
const lenientImage = z.preprocess((v) => {
  if (typeof v !== "string") return "";
  return v === "" || v.startsWith("/") || /^https?:\/\//.test(v) ? v : "";
}, z.string());

// Hero image / slide object: { src, alt_en?, alt_es? }. Accepts a bare string too
// (normalized to { src }) for backward compatibility with the old string[] format.
const heroImageInput = z.preprocess(
  (v) => (typeof v === "string" ? { src: v } : v),
  z.object({
    src: lenientImage,
    alt_en: z.string().optional(),
    alt_es: z.string().optional(),
  }),
);

const CATEGORIES = [
  "AI Automation",
  "Templates",
  "Tools",
  "Developer Tools",
  "Client Work",
  "Games",
  "Marketing",
  "Creative",
] as const;

// Schema that accepts both old and new field names for backward compatibility
const RawFrontmatterSchema = z.object({
  // Control flags
  portfolio_enabled: z.boolean(),
  // Priority is a sort key (lower = higher). Repos have drifted past the original 1-10
  // convention, so accept any sensible positive integer rather than failing the sync.
  portfolio_priority: z.number().min(1).max(999),
  portfolio_featured: z.boolean().optional().default(false),
  portfolio_last_reviewed: z.string().optional(),

  // Card display
  title: z.string().min(1).max(100),
  tagline: z.string().min(1).max(300),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(CATEGORIES),
  tech_stack: z.array(z.string()).min(1).max(20),
  thumbnail: lenientImage.default(""),
  thumbnail_url: lenientImage.optional(), // Legacy alias

  // Status (new) or complexity (legacy)
  status: z.enum(["Production", "MVP", "Demo", "Archived"]).optional(),
  complexity: z.enum(["MVP", "Production", "Enterprise"]).optional(), // Legacy

  // Detail page - new fields
  problem: z.string().max(2000).optional(),
  solution: z.string().max(2000).optional(),
  key_features: z.array(z.string()).max(20).optional(),
  metrics: z.array(z.string()).max(12).optional(),

  // Detail page - legacy fields
  problem_solved: z.string().max(2000).optional(),
  key_outcomes: z.array(z.string()).max(20).optional(),
  target_audience: z.string().optional(),

  // Links
  demo_url: z.string().url().or(z.literal("")).optional(),
  live_url: z.string().url().or(z.literal("")).optional(),
  case_study_url: z.string().optional(),
  demo_video_url: lenientImage.optional(),

  // Video (from PORTFOLIO.md frontmatter)
  video_url: lenientImage.optional(),
  video_poster: lenientImage.optional(),

  // Optional extras — hero_images and slides both accept string | { src, alt_en, alt_es }
  hero_images: z.array(heroImageInput).max(20).default([]),
  hero_image_urls: z.array(heroImageInput).optional(), // Legacy alias
  slides: z.array(heroImageInput).max(20).optional(), // Rich slide format → hero_images
  tags: z.array(z.string()).max(20).default([]),
  date_completed: z.string().optional(),
});

// Pick the first non-empty hero-image source list, then drop any entry whose src
// resolved to empty so downstream never renders a blank slide.
function resolveHeroImages(
  data: z.infer<typeof RawFrontmatterSchema>,
): HeroImage[] {
  const source =
    data.slides && data.slides.length > 0
      ? data.slides
      : data.hero_images.length > 0
        ? data.hero_images
        : data.hero_image_urls || [];
  return source
    .map((img) => ({ src: img.src, alt_en: img.alt_en, alt_es: img.alt_es }))
    .filter((img) => img.src !== "");
}

// Transform to normalize old field names to new ones
export const PortfolioFrontmatterSchema = RawFrontmatterSchema.transform(
  (data) => ({
    portfolio_enabled: data.portfolio_enabled,
    portfolio_priority: data.portfolio_priority,
    portfolio_featured: data.portfolio_featured ?? false,
    title: data.title,
    tagline: data.tagline,
    slug: data.slug,
    category: data.category,
    tech_stack: data.tech_stack,
    thumbnail: data.thumbnail || data.thumbnail_url || "",
    status:
      data.status ||
      (data.complexity === "Enterprise" ? "Production" : data.complexity) ||
      "Production",
    problem: data.problem || data.problem_solved || "",
    solution: data.solution || "",
    key_features: (data.key_features || data.key_outcomes || []).slice(0, 12),
    metrics: (data.metrics || []).slice(0, 8),
    demo_url: data.demo_url || "",
    live_url: data.live_url || "",
    demo_video_url: data.demo_video_url || data.video_url || "",
    video_poster: data.video_poster || "",
    hero_images: resolveHeroImages(data),
    tags: data.tags.slice(0, 12),
    date_completed: data.date_completed,
  }),
);

export type PortfolioFrontmatter = z.infer<typeof PortfolioFrontmatterSchema>;
