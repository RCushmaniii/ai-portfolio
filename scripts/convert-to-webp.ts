/**
 * One-shot script: convert all .png and .jpg images in public/images/ to .webp
 * Run: npx tsx scripts/convert-to-webp.ts
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const QUALITY = 80;

async function main() {
  const files = fs.readdirSync(IMAGES_DIR).filter((f) =>
    /\.(png|jpe?g)$/i.test(f)
  );

  if (files.length === 0) {
    console.log('No PNG/JPG files found in public/images/');
    return;
  }

  console.log(`Converting ${files.length} images to WebP (quality ${QUALITY})...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputName = file.replace(/\.(png|jpe?g)$/i, '.webp');
    const outputPath = path.join(IMAGES_DIR, outputName);

    const beforeSize = fs.statSync(inputPath).size;
    totalBefore += beforeSize;

    await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);

    const afterSize = fs.statSync(outputPath).size;
    totalAfter += afterSize;

    const savings = ((1 - afterSize / beforeSize) * 100).toFixed(1);
    console.log(
      `  ${file} → ${outputName}  ` +
      `${(beforeSize / 1024).toFixed(0)}KB → ${(afterSize / 1024).toFixed(0)}KB  ` +
      `(${savings}% smaller)`
    );

    // Delete original
    fs.unlinkSync(inputPath);
  }

  const totalSavings = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB  ` +
    `(${totalSavings}% reduction)`
  );
}

main().catch(console.error);
