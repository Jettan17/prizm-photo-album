# Prizm Photo Album

A modern photo gallery built with Next.js 15 and React 19. Features a responsive masonry layout, fullscreen lightbox with EXIF metadata display, and animated sticky header.

## Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript 5.7

## Features

- **Masonry Gallery**: Responsive multi-column layout (1-4 columns based on viewport)
- **Lightbox Viewer**: Fullscreen photo viewing with keyboard navigation
- **EXIF Metadata**: Extracts and displays camera info (date, camera model, focal length, aperture, shutter speed, ISO)
- **Animated Header**: Sticky header that shrinks on scroll with smooth transitions
- **Lazy Loading**: Photos load on scroll with staggered reveal animations

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
- JPG/JPEG
- PNG
- WebP

Photos are automatically detected and displayed in a randomized order on each page load.

## Project Structure

```
prizm-photo-album/
├── public/
│   └── photos/           # Photo files (35 images)
├── src/
│   ├── app/
│   │   ├── globals.css   # Global styles and animations
│   │   ├── layout.tsx    # Root layout with fonts
│   │   └── page.tsx      # Home page
│   ├── components/
│   │   ├── Footer.tsx       # Footer component
│   │   ├── Lightbox.tsx     # Fullscreen photo viewer
│   │   ├── PhotoCard.tsx    # Individual photo card
│   │   ├── PhotoGallery.tsx # Masonry gallery container
│   │   └── StickyHeader.tsx # Animated header
│   └── lib/
│       ├── exif.ts       # EXIF metadata extraction
│       └── photos.ts     # Photo utilities
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

## License

Private project by Jethro Tan ([@jepho_tan](https://instagram.com/jepho_tan))
