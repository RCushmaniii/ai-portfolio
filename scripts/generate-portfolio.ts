#!/usr/bin/env tsx
/**
 * Portfolio Generator Script
 *
 * Generates PORTFOLIO.md files for repos that don't have one.
 * Can work in two modes:
 *   1. List mode (default): Shows repos missing PORTFOLIO.md
 *   2. Generate mode: Creates draft PORTFOLIO.md files
 *   3. Push mode: Pushes generated files to GitHub
 *
 * Usage:
 *   pnpm generate-portfolio          # List repos without PORTFOLIO.md
 *   pnpm generate-portfolio --draft  # Generate drafts locally
 *   pnpm generate-portfolio --push   # Generate and push to GitHub
 */

import 'dotenv/config';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'RCushmaniii';

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  private: boolean;
  created_at: string;
  updated_at: string;
}

interface PageContent {
  title: string;
  description: string;
  headings: string[];
  features: string[];
  rawText: string;
}

interface RepoAnalysis {
  repo: GitHubRepo;
  hasPortfolio: boolean;
  suggestedCategory: string;
  suggestedPriority: number;
  pageContent: PageContent | null;
}

// Fetch and parse homepage content
async function fetchPageContent(url: string): Promise<PageContent | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract headings (h1, h2)
    const headingMatches = html.matchAll(/<h[12][^>]*>([^<]+)<\/h[12]>/gi);
    const headings: string[] = [];
    for (const match of headingMatches) {
      const text = match[1].replace(/<[^>]+>/g, '').trim();
      if (text && text.length > 3 && text.length < 200) {
        headings.push(text);
      }
    }

    // Extract list items (potential features)
    const liMatches = html.matchAll(/<li[^>]*>([^<]+(?:<[^>]+>[^<]*)*)<\/li>/gi);
    const features: string[] = [];
    for (const match of liMatches) {
      const text = match[1].replace(/<[^>]+>/g, '').trim();
      if (text && text.length > 10 && text.length < 150 && !text.includes('http')) {
        features.push(text);
      }
    }

    // Extract raw text for analysis (strip HTML)
    const rawText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);

    return { title, description, headings, features: features.slice(0, 10), rawText };
  } catch {
    return null;
  }
}

// Generate problem statement from page content
function generateProblem(repo: GitHubRepo, pageContent: PageContent | null): string {
  // Try to extract from meta description or headings
  if (pageContent?.description) {
    // If description mentions a pain point, use it
    const desc = pageContent.description;
    if (desc.length > 50 && desc.length < 300) {
      return desc;
    }
  }

  // Infer from repo description
  if (repo.description && repo.description.length > 30) {
    const desc = repo.description;
    // Convert feature-focused description to problem-focused
    if (desc.toLowerCase().includes('help') || desc.toLowerCase().includes('automat')) {
      return desc;
    }
  }

  return '';
}

// Generate solution statement from page content
function generateSolution(repo: GitHubRepo, pageContent: PageContent | null): string {
  // Use first meaningful heading or description
  if (pageContent?.headings.length) {
    const tagline = pageContent.headings.find(h =>
      h.length > 20 && h.length < 150 &&
      !h.toLowerCase().includes('cookie') &&
      !h.toLowerCase().includes('privacy')
    );
    if (tagline) return tagline;
  }

  // Fall back to repo description if it sounds like a solution
  if (repo.description && repo.description.length > 20) {
    return repo.description;
  }

  return '';
}

// Extract key features from page content
function extractFeatures(pageContent: PageContent | null): string[] {
  if (!pageContent) return [];

  const features: string[] = [];

  // Use list items that look like features
  for (const feature of pageContent.features) {
    if (feature.length > 15 && feature.length < 120) {
      // Clean up and add
      const cleaned = feature.replace(/^[-•*]\s*/, '').trim();
      if (cleaned && !features.includes(cleaned)) {
        features.push(cleaned);
      }
    }
    if (features.length >= 5) break;
  }

  // Also try headings as features
  if (features.length < 3 && pageContent.headings.length > 2) {
    for (const heading of pageContent.headings.slice(1, 6)) {
      if (heading.length > 10 && heading.length < 80 && !features.includes(heading)) {
        features.push(heading);
      }
      if (features.length >= 5) break;
    }
  }

  return features;
}

// Infer category from repo name, description, and topics
function inferCategory(repo: GitHubRepo): string {
  const text = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`.toLowerCase();

  if (text.includes('ai') || text.includes('chatbot') || text.includes('gpt') || text.includes('llm')) {
    return 'AI Automation';
  }
  if (text.includes('starter') || text.includes('template') || text.includes('boilerplate')) {
    return 'Templates';
  }
  if (text.includes('client') || text.includes('agency') || text.includes('freelance')) {
    return 'Client Work';
  }
  return 'Tools';
}

// Infer priority based on repo activity and features
function inferPriority(repo: GitHubRepo): number {
  let priority = 5; // Default mid-range

  // Featured if has good description
  if (repo.description && repo.description.length > 50) priority -= 1;

  // Featured if has topics
  if (repo.topics.length >= 3) priority -= 1;

  // More recent = higher priority
  const monthsOld = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsOld < 3) priority -= 1;
  if (monthsOld > 12) priority += 1;

  return Math.max(1, Math.min(10, priority));
}

// Generate slug from repo name
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Generate PORTFOLIO.md content
function generatePortfolioContent(
  repo: GitHubRepo,
  category: string,
  priority: number,
  pageContent: PageContent | null
): string {
  const slug = generateSlug(repo.name);
  const techStack = inferTechStack(repo);
  const status = inferStatus(repo);

  // Generate problem/solution from page content
  const problem = generateProblem(repo, pageContent);
  const solution = generateSolution(repo, pageContent);
  const features = extractFeatures(pageContent);

  // Use homepage as demo/live URL
  const liveUrl = repo.homepage || '';
  const demoUrl = liveUrl.includes('demo') ? liveUrl : '';
  const actualLiveUrl = demoUrl ? '' : liveUrl;

  // Format features
  const featureLines = features.length > 0
    ? features.map(f => `  - "${f.replace(/"/g, '\\"')}"`).join('\n')
    : '  - "TODO: Feature 1 with measurable impact"\n  - "TODO: Feature 2 explaining capability"\n  - "TODO: Feature 3 showing value"';

  return `---
# === CONTROL FLAGS ===
portfolio_enabled: true
portfolio_priority: ${priority}
portfolio_featured: ${priority <= 3}

# === CARD DISPLAY ===
title: "${formatTitle(repo.name)}"
tagline: "${(repo.description || 'TODO: Add a compelling one-line description').replace(/"/g, '\\"')}"
slug: "${slug}"
category: "${category}"
tech_stack:
${techStack.map(t => `  - "${t}"`).join('\n')}
thumbnail: ""
status: "${status}"

# === DETAIL PAGE ===
problem: "${problem ? problem.replace(/"/g, '\\"') : 'TODO: Describe the pain point this project solves.'}"
solution: "${solution ? solution.replace(/"/g, '\\"') : 'TODO: Describe how this project solves the problem.'}"
key_features:
${featureLines}
metrics: []

# === LINKS ===
demo_url: "${demoUrl}"
live_url: "${actualLiveUrl}"

# === OPTIONAL ===
hero_images: []
tags:
${repo.topics.slice(0, 5).map(t => `  - "${t}"`).join('\n') || '  - "todo"'}
date_completed: "${new Date(repo.created_at).toISOString().slice(0, 7)}"
---

<!-- TODO: Add 2-3 paragraphs describing this project -->
<!-- Focus on the business value and what makes this project notable -->
`;
}

// Infer tech stack from language and topics
function inferTechStack(repo: GitHubRepo): string[] {
  const stack: string[] = [];
  const topics = repo.topics.map(t => t.toLowerCase());

  // Primary language
  if (repo.language) {
    stack.push(repo.language);
  }

  // Infer from topics
  const techMappings: Record<string, string> = {
    nextjs: 'Next.js',
    react: 'React',
    typescript: 'TypeScript',
    tailwindcss: 'Tailwind CSS',
    supabase: 'Supabase',
    prisma: 'Prisma',
    openai: 'OpenAI API',
    fastapi: 'FastAPI',
    python: 'Python',
    nodejs: 'Node.js',
  };

  for (const [topic, techName] of Object.entries(techMappings)) {
    if (topics.includes(topic) && !stack.includes(techName)) {
      stack.push(techName);
    }
  }

  // Ensure at least 3 items
  if (stack.length < 3) {
    if (!stack.includes('TypeScript') && repo.language === 'TypeScript') {
      // Already added
    } else {
      stack.push('TODO: Add tech');
    }
  }

  return stack.slice(0, 6);
}

// Infer status from repo age and activity
function inferStatus(repo: GitHubRepo): string {
  const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  const name = repo.name.toLowerCase();

  if (name.includes('starter') || name.includes('template')) return 'Production';
  if (daysSinceUpdate > 180) return 'Archived';
  if (name.includes('mvp') || name.includes('demo')) return 'MVP';
  return 'Production';
}

// Format repo name as title
function formatTitle(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bSaas\b/g, 'SaaS');
}

async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `${GITHUB_API}/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'portfolio-generator',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) break;
    repos.push(...data);
    page++;
    if (page > 5) break;
  }

  return repos;
}

async function checkHasPortfolio(repoName: string, token: string): Promise<boolean> {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repoName}/contents/PORTFOLIO.md`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-generator',
      },
    }
  );
  return response.status === 200;
}

async function pushPortfolioToRepo(
  repoName: string,
  content: string,
  token: string
): Promise<boolean> {
  // First check if file exists (need SHA for update)
  const checkResponse = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repoName}/contents/PORTFOLIO.md`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-generator',
      },
    }
  );

  const body: Record<string, string> = {
    message: 'Add PORTFOLIO.md for portfolio site',
    content: Buffer.from(content).toString('base64'),
  };

  if (checkResponse.status === 200) {
    const existingFile = await checkResponse.json();
    body.sha = existingFile.sha;
    body.message = 'Update PORTFOLIO.md';
  }

  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repoName}/contents/PORTFOLIO.md`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  return response.status === 200 || response.status === 201;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const draftMode = args.includes('--draft');
  const pushMode = args.includes('--push');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  const repoFilter = args.find(a => !a.startsWith('--'));

  console.log('🔍 Fetching repositories...\n');

  const repos = await fetchUserRepos(token);
  console.log(`📦 Found ${repos.length} repositories\n`);

  // Filter repos if specified
  const filteredRepos = repoFilter
    ? repos.filter(r => r.name.toLowerCase().includes(repoFilter.toLowerCase()))
    : repos;

  // Analyze each repo
  const analyses: RepoAnalysis[] = [];
  for (const repo of filteredRepos) {
    process.stdout.write(`  Checking ${repo.name}... `);
    const hasPortfolio = await checkHasPortfolio(repo.name, token);
    const category = inferCategory(repo);
    const priority = inferPriority(repo);

    // Fetch page content if repo has homepage and we're in draft/push mode
    let pageContent: PageContent | null = null;
    if (!hasPortfolio && repo.homepage && (draftMode || pushMode)) {
      process.stdout.write('fetching homepage... ');
      pageContent = await fetchPageContent(repo.homepage);
    }

    analyses.push({ repo, hasPortfolio, suggestedCategory: category, suggestedPriority: priority, pageContent });
    console.log(hasPortfolio ? '✓ Has PORTFOLIO.md' : (pageContent ? '✗ Missing (homepage found)' : '✗ Missing'));
  }

  let missing = analyses.filter(a => !a.hasPortfolio);

  // Apply limit if specified
  if (limit && limit > 0) {
    missing = missing.slice(0, limit);
  }

  if (missing.length === 0) {
    console.log('\n✅ All repositories have PORTFOLIO.md files!');
    return;
  }

  console.log(`\n📋 ${missing.length} repositories missing PORTFOLIO.md:\n`);
  console.log('Repo Name                         | Category        | Priority');
  console.log('----------------------------------|-----------------|----------');
  for (const { repo, suggestedCategory, suggestedPriority } of missing) {
    console.log(
      `${repo.name.padEnd(33)} | ${suggestedCategory.padEnd(15)} | ${suggestedPriority}`
    );
  }

  if (!draftMode && !pushMode) {
    console.log('\nRun with --draft to generate local files or --push to create in GitHub.');
    return;
  }

  console.log('\n' + (pushMode ? '📤 Pushing' : '📝 Generating') + ' PORTFOLIO.md files...\n');

  for (const { repo, suggestedCategory, suggestedPriority, pageContent } of missing) {
    const content = generatePortfolioContent(repo, suggestedCategory, suggestedPriority, pageContent);

    if (pushMode) {
      process.stdout.write(`  ${repo.name}: `);
      const success = await pushPortfolioToRepo(repo.name, content, token);
      console.log(success ? '✅ Pushed' : '❌ Failed');
    } else {
      // Write to local file for review
      const fs = await import('fs/promises');
      const path = await import('path');
      const outputDir = path.join(process.cwd(), 'portfolio-drafts');
      await fs.mkdir(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, `PORTFOLIO-${repo.name}.md`);
      await fs.writeFile(outputPath, content, 'utf-8');
      console.log(`  ✅ ${repo.name} → portfolio-drafts/PORTFOLIO-${repo.name}.md`);
    }
  }

  console.log('\n✅ Done!');
  if (draftMode) {
    console.log('\nReview drafts in ./portfolio-drafts/ and fill in TODOs before pushing.');
  }
}

main().catch(console.error);
