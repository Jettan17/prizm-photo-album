// Photo manifest generated at build time by scripts/generate-photos.js
// This avoids bundling the entire photos directory into serverless functions
import photosManifest from "./photos-manifest.json";

export interface Photo {
  filename: string;
  src: string;
}

export function getPhotos(): Photo[] {
  return photosManifest as Photo[];
}
