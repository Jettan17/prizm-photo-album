# Prizm Photo Album

A modern photo gallery built with Next.js 15 and React 19. Features a responsive masonry layout, fullscreen lightbox with rich EXIF metadata display including location, and animated sticky header.

**Live Demo:** [prizm-photo-album.vercel.app](https://prizm-photo-album.vercel.app)

## Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript 5.7
- **Deployment**: Vercel

## Features

- **Masonry Gallery**: Responsive multi-column layout (1-4 columns based on viewport)
- **Lightbox Viewer**: Fullscreen photo viewing with keyboard navigation
- **Rich EXIF Metadata**: Extracts and displays comprehensive camera info:
  - Date taken
  - Camera model
  - Lens model
  - Focal length (with 35mm equivalent)
  - Aperture, shutter speed, ISO
  - Exposure compensation
  - **Location** (reverse geocoded from GPS coordinates)
- **Animated Header**: Sticky header that shrinks on scroll (100px → 48px)
- **Lazy Loading**: Photos load on scroll with staggered reveal animations
- **Location Caching**: GPS coordinates cached to minimize API calls

## Prerequisites

- Node.js >= 18
- npm or yarn

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Adding Photos

Place your photos in the `public/photos/` directory. Supported formats:
- JPG/JPEG (with EXIF support)
- PNG
- WebP

Photos are automatically detected and displayed in a randomized order on each page load. EXIF metadata including GPS location is extracted client-side.

## Project Structure

```
prizm-photo-album/
├── public/
│   └── photos/              # Photo files (35 images)
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles and animations
│   │   ├── layout.tsx       # Root layout with fonts
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── Footer.tsx       # Footer component
│   │   ├── Lightbox.tsx     # Fullscreen viewer + EXIF display
│   │   ├── PhotoCard.tsx    # Individual photo card
│   │   ├── PhotoGallery.tsx # Masonry gallery container
│   │   └── StickyHeader.tsx # Animated header
│   └── lib/
│       ├── exif.ts          # EXIF extraction + reverse geocoding
│       └── photos.ts        # Photo manifest utilities
├── scripts/
│   └── generate-photos.js   # Build-time photo manifest generator
├── vercel.json              # Vercel deployment config
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close lightbox |
| `Arrow Left` | Previous photo |
| `Arrow Right` | Next photo |
| `i` | Toggle photo info |

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

Deployed on Vercel with automatic builds on push to main.

```bash
# Deploy via CLI
npm i -g vercel
vercel --prod
```

See [docs/DEPLOY.md](docs/DEPLOY.md) for detailed deployment instructions.

## License

Private project by Jethro Tan ([@jepho_tan](https://instagram.com/jepho_tan))
