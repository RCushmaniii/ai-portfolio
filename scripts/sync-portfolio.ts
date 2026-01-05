import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { PortfolioFrontmatterSchema } from '../src/lib/portfolio/schema';
import type { PortfolioProject, PortfolioData } from '../src/lib/portfolio/types';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'RCushmaniii';
const OUTPUT_PATH = path.join(process.cwd(), 'content', 'portfolio.json');

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  private: boolean;
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
          'User-Agent': 'portfolio-sync-script',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) throw new Error('Invalid GitHub token');
      if (response.status === 403) throw new Error('Rate limit exceeded');
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) break;
    repos.push(...data); // Include all repos (public and private)
    page++;
    if (page > 10) break;
  }

  return repos;
}

async function fetchPortfolioMd(repoName: string, token: string): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repoName}/contents/PORTFOLIO.md`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw',
        'User-Agent': 'portfolio-sync-script',
      },
    }
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
  return response.text();
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  console.log('🔄 Starting portfolio sync...\n');

  const repos = await fetchUserRepos(token);
  const privateCount = repos.filter(r => r.private).length;
  console.log(`📦 Found ${repos.length} repositories (${privateCount} private)\n`);

  const projects: PortfolioProject[] = [];

  for (const repo of repos) {
    process.stdout.write(`  ${repo.name}: `);

    try {
      const content = await fetchPortfolioMd(repo.name, token);

      if (!content) {
        console.log('⏭️  No PORTFOLIO.md');
        continue;
      }

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
        repo_name: repo.name,
        repo_url: repo.html_url,
        github_stars: repo.stargazers_count,
        github_forks: repo.forks_count,
        github_language: repo.language,
        github_updated_at: repo.updated_at,
        github_description: repo.description || '',
        github_topics: repo.topics || [],
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
  console.log(`✅ Sync complete: ${projects.length} projects\n`);
}

main().catch(console.error);
