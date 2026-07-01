/* eslint-disable security/detect-non-literal-fs-filename */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredImages = [
  "hero-origin.png",
  "studio-reflection.png",
  "volcanic-bottle.png",
  "market-lifestyle.png",
  "night-routine.png",
  "barbershop.png",
  "packing-orders.png",
  "front-label.png",
  "back-label.png",
  "facebook-cover.png",
  "profile-logo.png",
];

const requiredSiteImageKeys = [
  "hero",
  "originMountCameroon",
  "studioBottle",
  "marketLifestyle",
  "nightRoutine",
  "barbershop",
  "packingOrders",
  "frontLabel",
  "backLabel",
  "facebookCover",
  "profileLogo",
];

const stalePatterns = [
  "ChatGPT Image",
  "hero-volcanic-bottle",
  "studio-reflection-bottle",
  "mount-cameroon-origin",
  "unsplash",
  "dummy image",
];

const sourceDirs = ["src", "public"];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx"]);
const failures = [];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(absolutePath));
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function relative(filePath) {
  return path.relative(root, filePath);
}

for (const fileName of requiredImages) {
  const imagePath = path.join(root, "public", "images", fileName);

  if (!existsSync(imagePath)) {
    failures.push(`Missing required image: public/images/${fileName}`);
  }
}

const imageRefs = new Set();
const sourceFiles = sourceDirs
  .map((dir) => path.join(root, dir))
  .filter((dir) => existsSync(dir))
  .flatMap(walk)
  .filter((file) => sourceExtensions.has(path.extname(file)));

for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");

  for (const stalePattern of stalePatterns) {
    if (text.includes(stalePattern)) {
      failures.push(`Stale image/reference text "${stalePattern}" found in ${relative(file)}`);
    }
  }

  for (const match of text.matchAll(
    /\/images\/[a-z0-9][a-z0-9\-/]*\.(?:png|jpg|jpeg|webp|avif)/g,
  )) {
    imageRefs.add(match[0]);
  }
}

for (const imageRef of [...imageRefs].sort()) {
  const imagePath = path.join(root, "public", imageRef.slice(1));

  if (!existsSync(imagePath)) {
    failures.push(`Broken public image reference: ${imageRef}`);
  }
}

const siteImagesPath = path.join(root, "src", "lib", "site-images.ts");
const siteImagesText = existsSync(siteImagesPath) ? readFileSync(siteImagesPath, "utf8") : "";

for (const key of requiredSiteImageKeys) {
  if (!siteImagesText.includes(`${key}:`)) {
    failures.push(`Missing siteImages key: ${key}`);
  }
}

if (failures.length > 0) {
  console.error("FONDJO diagnosis failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("FONDJO diagnosis passed:");
console.log(`- ${requiredImages.length} required campaign images found`);
console.log(`- ${imageRefs.size} public image references verified`);
console.log(`- ${requiredSiteImageKeys.length} siteImages keys verified`);
