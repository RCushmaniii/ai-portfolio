#!/usr/bin/env tsx
/**
 * Local Portfolio Sync
 *
 * Reads PORTFOLIO.md files from portfolio-drafts/ and portfolio-files/
 * and generates content/portfolio.json for local preview.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { PortfolioFrontmatterSchema } from '../src/lib/portfolio/schema';
import type { PortfolioProject, PortfolioData } from '../src/lib/portfolio/types';

const DRAFTS_DIR = path.join(process.cwd(), 'portfolio-drafts');
const FILES_DIR = path.join(process.cwd(), 'portfolio-files');
const OUTPUT_PATH = path.join(process.cwd(), 'content', 'portfolio.json');

async function readPortfolioFiles(dir: string): Promise<Map<string, string>> {
  const files = new Map<string, string>();

  try {
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
      if (entry.startsWith('PORTFOLIO') && entry.endsWith('.md') && !entry.includes('TEMPLATE')) {
        const content = await fs.readFile(path.join(dir, entry), 'utf-8');
        // Extract repo name from filename: PORTFOLIO-repo-name.md -> repo-name
        const repoName = entry.replace(/^PORTFOLIO-?/, '').replace(/\.md$/, '') || entry;
        files.set(repoName, content);
      }
    }
  } catch {
    // Directory doesn't exist, that's fine
  }

  return files;
}

async function main() {
  console.log('🔄 Local portfolio sync...\n');

  // Read from both directories, drafts take priority
  const portfolioFiles = await readPortfolioFiles(FILES_DIR);
  const draftFiles = await readPortfolioFiles(DRAFTS_DIR);

  // Merge, drafts override portfolio-files
  const allFiles = new Map([...portfolioFiles, ...draftFiles]);

  console.log(`📁 Found ${portfolioFiles.size} files in portfolio-files/`);
  console.log(`📁 Found ${draftFiles.size} files in portfolio-drafts/`);
  console.log(`📦 Total: ${allFiles.size} unique projects\n`);

  const projects: PortfolioProject[] = [];

  for (const [repoName, content] of allFiles) {
    process.stdout.write(`  ${repoName}: `);

    try {
      const { data: frontmatter, content: body } = matter(content);
      const result = PortfolioFrontmatterSchema.safeParse(frontmatter);

      if (!result.success) {
        console.log('❌ Invalid frontmatter');
        result.error.issues.forEach((issue) => {
          console.log(`     - ${issue.path.join('.')}: ${issue.message}`);
        });
        continue;
      }

      if (!result.data.portfolio_enabled) {
        console.log('⏭️  Disabled');
        continue;
      }

      const project: PortfolioProject = {
        ...result.data,
        body_markdown: body.trim(),
        repo_name: repoName,
        repo_url: `https://github.com/RCushmaniii/${repoName}`,
        github_stars: 0,
        github_forks: 0,
        github_language: null,
        github_updated_at: new Date().toISOString(),
        github_description: '',
        github_topics: [],
      };

      projects.push(project);
      console.log('✅ Added');
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : error}`);
    }
  }

  projects.sort((a, b) => a.portfolio_priority - b.portfolio_priority);

  const output: PortfolioData = {
    generated_at: new Date().toISOString(),
    projects,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n📄 Wrote to: ${OUTPUT_PATH}`);
  console.log(`✅ Local sync complete: ${projects.length} projects\n`);
}

main().catch(console.error);
