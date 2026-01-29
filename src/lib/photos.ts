import fs from "fs";
import path from "path";

const PHOTOS_DIRECTORY = path.join(process.cwd(), "public", "photos");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

export interface Photo {
  filename: string;
  src: string;
}

export function getPhotos(): Photo[] {
  if (!fs.existsSync(PHOTOS_DIRECTORY)) {
    return [];
  }

  const files = fs.readdirSync(PHOTOS_DIRECTORY);

  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    })
    .map((filename) => ({
      filename,
      src: `/photos/${filename}`,
    }));
}
