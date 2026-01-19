#!/usr/bin/env tsx
/**
 * Image Sync Script
 *
 * Finds and syncs images from GitHub repos for portfolio projects.
 * Can either use GitHub raw URLs or download to local public folder.
 *
 * Usage:
 *   pnpm sync:images              # List available images (dry run)
 *   pnpm sync:images --urls       # Output GitHub raw URLs for each project
 *   pnpm sync:images --download   # Download images to public/portfolio/
 */

import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'RCushmaniii';
const GITHUB_RAW = 'https://raw.githubusercontent.com';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'portfolio');

// Common image folder names to search
const IMAGE_FOLDERS = ['screenshots', 'images', 'public/images', 'public/screenshots', 'docs/images', 'assets'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

interface RepoImage {
  name: string;
  path: string;
  download_url: string;
  raw_url: string;
}

interface ProjectImages {
  repoName: string;
  slug: string;
  thumbnail: string | null;
  images: RepoImage[];
}

async function fetchRepoContents(repoName: string, folderPath: string, token: string): Promise<RepoImage[]> {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repoName}/contents/${folderPath}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-image-sync',
      },
    }
  );

  if (!response.ok) return [];

  const contents = await response.json();
  if (!Array.isArray(contents)) return [];

  return contents
    .filter((item: { type: string; name: string }) => {
      if (item.type !== 'file') return false;
      const ext = path.extname(item.name).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .map((item: { name: string; path: string; download_url: string }) => ({
      name: item.name,
      path: item.path,
      download_url: item.download_url,
      raw_url: `${GITHUB_RAW}/${GITHUB_USER}/${repoName}/main/${item.path}`,
    }));
}

async function findProjectImages(repoName: string, token: string): Promise<RepoImage[]> {
  const allImages: RepoImage[] = [];

  for (const folder of IMAGE_FOLDERS) {
    const images = await fetchRepoContents(repoName, folder, token);
    allImages.push(...images);
  }

  // Also check root for common thumbnail names
  const rootImages = await fetchRepoContents(repoName, '', token);
  const thumbnailNames = ['thumbnail', 'screenshot', 'preview', 'hero', 'cover', 'banner'];
  const rootThumbnails = rootImages.filter(img =>
    thumbnailNames.some(name => img.name.toLowerCase().includes(name))
  );
  allImages.push(...rootThumbnails);

  return allImages;
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;

    const buffer = await response.arrayBuffer();
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.writeFile(destPath, Buffer.from(buffer));
    return true;
  } catch {
    return false;
  }
}

async function loadPortfolioData(): Promise<{ slug: string; repo_name: string }[]> {
  try {
    const data = require('../content/portfolio.json');
    return data.projects.map((p: { slug: string; repo_name: string }) => ({
      slug: p.slug,
      repo_name: p.repo_name,
    }));
  } catch {
    return [];
  }
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const urlsMode = args.includes('--urls');
  const downloadMode = args.includes('--download');
  const projectFilter = args.find(a => !a.startsWith('--'));

  console.log('🖼️  Portfolio Image Sync\n');

  // Load portfolio projects
  const projects = await loadPortfolioData();
  if (projects.length === 0) {
    console.log('No projects found. Run pnpm sync:local first.');
    return;
  }

  const filteredProjects = projectFilter
    ? projects.filter(p => p.slug.includes(projectFilter) || p.repo_name.includes(projectFilter))
    : projects;

  console.log(`📦 Scanning ${filteredProjects.length} projects for images...\n`);

  const results: ProjectImages[] = [];

  for (const project of filteredProjects) {
    process.stdout.write(`  ${project.repo_name}: `);

    const images = await findProjectImages(project.repo_name, token);

    if (images.length === 0) {
      console.log('No images found');
      continue;
    }

    // Pick first image as thumbnail candidate
    const thumbnail = images.find(img =>
      img.name.toLowerCase().includes('thumbnail') ||
      img.name.toLowerCase().includes('hero') ||
      img.name.toLowerCase().includes('preview')
    ) || images[0];

    results.push({
      repoName: project.repo_name,
      slug: project.slug,
      thumbnail: thumbnail?.raw_url || null,
      images,
    });

    console.log(`Found ${images.length} images`);
  }

  if (results.length === 0) {
    console.log('\n❌ No images found in any repository.');
    return;
  }

  console.log(`\n📊 Found images in ${results.length} projects\n`);

  if (urlsMode) {
    console.log('='.repeat(60));
    console.log('GitHub Raw URLs (add to PORTFOLIO.md files)\n');

    for (const project of results) {
      console.log(`\n## ${project.slug}`);
      console.log(`thumbnail: "${project.thumbnail}"`);
      console.log('hero_images:');
      for (const img of project.images.slice(0, 6)) {
        console.log(`  - "${img.raw_url}"`);
      }
    }
  } else if (downloadMode) {
    console.log('📥 Downloading images...\n');

    for (const project of results) {
      const projectDir = path.join(OUTPUT_DIR, project.slug);
      console.log(`  ${project.slug}:`);

      for (const img of project.images) {
        const destPath = path.join(projectDir, img.name);
        const success = await downloadImage(img.download_url, destPath);
        console.log(`    ${success ? '✅' : '❌'} ${img.name}`);
      }
    }

    console.log('\n✅ Images downloaded to public/portfolio/');
    console.log('\nUpdate PORTFOLIO.md files with local paths:');
    console.log('  thumbnail: "/portfolio/{slug}/{filename}"');
  } else {
    // Dry run - just list what's available
    console.log('Available images:\n');
    for (const project of results) {
      console.log(`${project.slug}:`);
      for (const img of project.images.slice(0, 5)) {
        console.log(`  - ${img.name}`);
      }
      if (project.images.length > 5) {
        console.log(`  ... and ${project.images.length - 5} more`);
      }
    }
    console.log('\nRun with --urls to get GitHub raw URLs');
    console.log('Run with --download to download to public/portfolio/');
  }
}

main().catch(console.error);
