/**
 * Generate photo manifest at build time.
 * Run: node scripts/generate-photos.js
 */

const fs = require("fs");
const path = require("path");

const PHOTOS_DIRECTORY = path.join(process.cwd(), "public", "photos");
const OUTPUT_FILE = path.join(process.cwd(), "src", "lib", "photos-manifest.json");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

function generatePhotoManifest() {
  if (!fs.existsSync(PHOTOS_DIRECTORY)) {
    console.log("No photos directory found, creating empty manifest");
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  const files = fs.readdirSync(PHOTOS_DIRECTORY);

  const photos = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    })
    .map((filename) => ({
      filename,
      src: `/photos/${filename}`,
    }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photos, null, 2));
  console.log(`Generated manifest with ${photos.length} photos`);
}

generatePhotoManifest();
