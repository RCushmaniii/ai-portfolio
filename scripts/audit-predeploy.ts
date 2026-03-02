/**
 * Pre-Deploy Audit Script — AI Portfolio
 *
 * Runs 6 sequential stages to verify the site is safe to deploy.
 * Exits with code 1 on first failure (fail-fast).
 *
 * Usage: npx tsx scripts/audit-predeploy.ts
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

// ─── Helpers ───────────────────────────────────────────────────────────

function pass(stage: number, label: string, detail: string) {
  console.log(`✅ Stage ${stage}: ${label} — ${detail}`);
}

function fail(stage: number, label: string, detail: string): never {
  console.error(`❌ Stage ${stage}: ${label} — ${detail}`);
  console.log('\n════════════════════════════════════');
  console.error(`❌ Audit FAILED at stage ${stage}`);
  process.exit(1);
}

function separator() {
  console.log('════════════════════════════════════');
}

// ─── Stage 1: Data Files ───────────────────────────────────────────────

function stage1_dataFiles() {
  const portfolioPath = path.join(CONTENT_DIR, 'portfolio.json');

  if (!fs.existsSync(portfolioPath)) {
    fail(1, 'Data files', 'content/portfolio.json does not exist');
  }

  const raw = fs.readFileSync(portfolioPath, 'utf-8');
  if (!raw.trim()) {
    fail(1, 'Data files', 'content/portfolio.json is empty');
  }

  let data: { projects?: unknown[] };
  try {
    data = JSON.parse(raw);
  } catch {
    fail(1, 'Data files', 'content/portfolio.json contains invalid JSON');
  }

  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    fail(1, 'Data files', 'content/portfolio.json has 0 projects');
  }

  pass(1, 'Data files verified', `${data.projects.length} projects`);
}

// ─── Stage 2: Secret Leak Scan ─────────────────────────────────────────

function stage2_secretScan() {
  const SECRET_PATTERNS = [
    { name: 'OpenAI API key', pattern: /sk-[a-zA-Z0-9]{20,}/ },
    { name: 'GitHub PAT', pattern: /ghp_[a-zA-Z0-9]{36}/ },
    { name: 'GitHub OAuth', pattern: /gho_[a-zA-Z0-9]{36}/ },
    { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/ },
    { name: 'Generic secret assignment', pattern: /(?:secret|password|token|api_key)\s*[:=]\s*['"][a-zA-Z0-9+/=]{20,}['"]/i },
  ];

  const EXTENSIONS = ['.ts', '.tsx', '.json'];
  const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', '.vercel'];
  const IGNORE_FILES = ['audit-predeploy.ts']; // This file has the patterns as regex

  function scanDir(dir: string): string[] {
    const findings: string[] = [];
    let entries: fs.Dirent[];

    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return findings;
    }

    for (const entry of entries) {
      if (IGNORE_DIRS.includes(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findings.push(...scanDir(fullPath));
      } else if (entry.isFile() && EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
        if (IGNORE_FILES.includes(entry.name)) continue;

        const content = fs.readFileSync(fullPath, 'utf-8');
        const relativePath = path.relative(ROOT, fullPath).replace(/\\/g, '/');

        for (const { name, pattern } of SECRET_PATTERNS) {
          if (pattern.test(content)) {
            findings.push(`  ${relativePath}: ${name}`);
          }
        }
      }
    }

    return findings;
  }

  const findings = scanDir(ROOT);

  if (findings.length > 0) {
    console.error('  Potential secrets found:');
    findings.forEach((f) => console.error(f));
    fail(2, 'Secret leak scan', `${findings.length} potential secret(s) detected`);
  }

  pass(2, 'No secrets detected', '');
}

// ─── Stage 3: i18n Parity ──────────────────────────────────────────────

function stage3_i18nParity() {
  const enPath = path.join(ROOT, 'src', 'i18n', 'translations', 'en.ts');
  const esPath = path.join(ROOT, 'src', 'i18n', 'translations', 'es.ts');

  if (!fs.existsSync(enPath)) fail(3, 'i18n parity', 'en.ts not found');
  if (!fs.existsSync(esPath)) fail(3, 'i18n parity', 'es.ts not found');

  // Extract keys using regex (avoids needing to import .ts at runtime)
  function extractKeys(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const keys: string[] = [];
    // Match "key:" or 'key:' patterns at start of line (with optional whitespace)
    const keyRegex = /^\s+(\w+)\s*:/gm;
    let match: RegExpExecArray | null;
    while ((match = keyRegex.exec(content)) !== null) {
      keys.push(match[1]);
    }
    return keys.sort();
  }

  const enKeys = extractKeys(enPath);
  const esKeys = extractKeys(esPath);

  const missingInEs = enKeys.filter((k) => !esKeys.includes(k));
  const missingInEn = esKeys.filter((k) => !enKeys.includes(k));

  if (missingInEs.length > 0 || missingInEn.length > 0) {
    if (missingInEs.length > 0) {
      console.error(`  Missing in es.ts: ${missingInEs.join(', ')}`);
    }
    if (missingInEn.length > 0) {
      console.error(`  Missing in en.ts: ${missingInEn.join(', ')}`);
    }
    fail(3, 'i18n parity', 'Translation key mismatch between en and es');
  }

  pass(3, 'i18n parity confirmed', `en: ${enKeys.length} keys, es: ${esKeys.length} keys`);
}

// ─── Stage 4: TypeScript ────────────────────────────────────────────────

function stage4_typescript() {
  try {
    execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' });
    pass(4, 'TypeScript', 'no errors');
  } catch (err) {
    const output = err instanceof Error && 'stdout' in err
      ? (err as { stdout: Buffer }).stdout?.toString() || ''
      : '';
    if (output) console.error(output.slice(0, 2000));
    fail(4, 'TypeScript', 'type errors found');
  }
}

// ─── Stage 5: Build ────────────────────────────────────────────────────

function stage5_build() {
  try {
    execSync('npx next build', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 });
    pass(5, 'Build', 'success');
  } catch (err) {
    const output = err instanceof Error && 'stderr' in err
      ? (err as { stderr: Buffer }).stderr?.toString() || ''
      : '';
    if (output) console.error(output.slice(0, 2000));
    fail(5, 'Build', 'build failed');
  }
}

// ─── Stage 6: Static Artifacts ─────────────────────────────────────────

function stage6_staticArtifacts() {
  const nextDir = path.join(ROOT, '.next');
  if (!fs.existsSync(nextDir)) {
    fail(6, 'Static artifacts', '.next/ directory not found after build');
  }

  // Check for sitemap in common locations
  const sitemapLocations = [
    path.join(ROOT, '.next', 'server', 'app', 'sitemap.xml.meta'),
    path.join(ROOT, '.next', 'server', 'app', 'sitemap.xml.body'),
    path.join(ROOT, 'public', 'sitemap.xml'),
  ];

  const sitemapFound = sitemapLocations.some((loc) => fs.existsSync(loc));

  if (sitemapFound) {
    pass(6, 'Static artifacts verified', '.next/ exists, sitemap generated');
  } else {
    // Sitemap not found is a warning, not a failure — some deploys generate it dynamically
    pass(6, 'Static artifacts verified', '.next/ exists (sitemap not found — may be dynamic)');
  }
}

// ─── Run All Stages ─────────────────────────────────────────────────────

console.log('\n🔍 AI Portfolio — Pre-Deploy Audit');
separator();

stage1_dataFiles();
stage2_secretScan();
stage3_i18nParity();
stage4_typescript();
stage5_build();
stage6_staticArtifacts();

separator();
console.log('✅ All 6 stages passed — safe to deploy\n');
