#!/usr/bin/env tsx
/**
 * Batch Update PORTFOLIO.md files via GitHub API
 *
 * Updates portfolio_enabled and category fields in existing PORTFOLIO.md files
 */

import 'dotenv/config';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'RCushmaniii';

interface UpdateConfig {
  repo: string;
  updates: {
    portfolio_enabled?: boolean;
    category?: string;
  };
}

const UPDATES: UpdateConfig[] = [
  // Projects to DISABLE
  { repo: 'ai-portfolio', updates: { portfolio_enabled: false } },
  { repo: 'RCushmaniii', updates: { portfolio_enabled: false } },
  { repo: 'lua_sprite_running', updates: { portfolio_enabled: false } },
  { repo: 'basic-pacman', updates: { portfolio_enabled: false } },
  { repo: 'lua-love2d-firstgame', updates: { portfolio_enabled: false } },
  { repo: 'lua_save_the_ball', updates: { portfolio_enabled: false } },
  { repo: 'rank-it-better', updates: { portfolio_enabled: false } },
  { repo: 'Web-Confirmation-Project', updates: { portfolio_enabled: false } },
  { repo: 'go-pack', updates: { portfolio_enabled: false } },
  { repo: 'json-updater', updates: { portfolio_enabled: false } },
  { repo: 'calendly-clone', updates: { portfolio_enabled: false } },
  { repo: 'cefr-question-generator', updates: { portfolio_enabled: false } },
  { repo: 'CEFR-English-Exam', updates: { portfolio_enabled: false } },
  { repo: 'guitar-sample-store', updates: { portfolio_enabled: false } },
  { repo: 'my-guitar-tabs', updates: { portfolio_enabled: false } },
  { repo: 'cushlabs', updates: { portfolio_enabled: false } },
  { repo: 'operating-system', updates: { portfolio_enabled: false } },
  { repo: 'order-now-mvp', updates: { portfolio_enabled: false } },
  { repo: 'yapanow-mvp2', updates: { portfolio_enabled: false } },
  { repo: 'ai-coach-vince', updates: { portfolio_enabled: false } },

  // Projects to FIX CATEGORIES
  { repo: 'marble-does-not-yield', updates: { category: 'Creative' } },
  { repo: 'nextjs-react-agency-starter', updates: { category: 'Templates' } },
  { repo: 'ai-filesense-website', updates: { category: 'Marketing' } },
  { repo: 'ai-scrabble-practice', updates: { category: 'Games' } },
];

async function getFileContent(repo: string, token: string): Promise<{ content: string; sha: string } | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repo}/contents/PORTFOLIO.md`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-batch-update',
      },
    }
  );

  if (!response.ok) {
    console.log(`  No PORTFOLIO.md found in ${repo}`);
    return null;
  }

  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content, sha: data.sha };
}

function updateFrontmatter(content: string, updates: UpdateConfig['updates']): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inFrontmatter = false;
  let frontmatterStarted = false;

  for (const line of lines) {
    if (line.trim() === '---') {
      if (!frontmatterStarted) {
        frontmatterStarted = true;
        inFrontmatter = true;
        result.push(line);
        continue;
      } else {
        inFrontmatter = false;
        result.push(line);
        continue;
      }
    }

    if (inFrontmatter) {
      // Check if this line should be updated
      if (updates.portfolio_enabled !== undefined && line.startsWith('portfolio_enabled:')) {
        result.push(`portfolio_enabled: ${updates.portfolio_enabled}`);
      } else if (updates.category !== undefined && line.startsWith('category:')) {
        result.push(`category: "${updates.category}"`);
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

async function updateFile(repo: string, content: string, sha: string, token: string): Promise<boolean> {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repo}/contents/PORTFOLIO.md`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-batch-update',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'chore: update portfolio settings',
        content: Buffer.from(content).toString('base64'),
        sha,
      }),
    }
  );

  return response.ok;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN required');
    process.exit(1);
  }

  const dryRun = process.argv.includes('--dry-run');

  console.log(`\nBatch updating ${UPDATES.length} repositories${dryRun ? ' (DRY RUN)' : ''}...\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const config of UPDATES) {
    process.stdout.write(`${config.repo}: `);

    const file = await getFileContent(config.repo, token);
    if (!file) {
      skipped++;
      continue;
    }

    const updatedContent = updateFrontmatter(file.content, config.updates);

    if (updatedContent === file.content) {
      console.log('No changes needed');
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`Would update: ${JSON.stringify(config.updates)}`);
      success++;
      continue;
    }

    const ok = await updateFile(config.repo, updatedContent, file.sha, token);
    if (ok) {
      console.log(`Updated ${JSON.stringify(config.updates)}`);
      success++;
    } else {
      console.log('FAILED');
      failed++;
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nComplete: ${success} updated, ${skipped} skipped, ${failed} failed`);
}

main().catch(console.error);
