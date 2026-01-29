# Architecture Overview

Last updated: 2026-01-29

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App                         │
├─────────────────────────────────────────────────────────┤
│  page.tsx                                               │
│  ├── StickyHeader (client)                              │
│  ├── PhotoGallery (client)                              │
│  │   ├── PhotoCard[] (client)                           │
│  │   └── Lightbox (client, conditional)                 │
│  └── Footer                                             │
├─────────────────────────────────────────────────────────┤
│  lib/                                                   │
│  ├── photos.ts (server) - File system photo discovery   │
│  └── exif.ts (client) - Binary EXIF parsing             │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. Server-side:
   page.tsx → getPhotos() → reads public/photos/*.{jpg,png,webp}
                          → returns Photo[] with src paths

2. Client-side:
   PhotoGallery → shuffles photos on mount
               → renders PhotoCard for each photo
               → manages lightbox state

3. EXIF extraction (on-demand):
   Lightbox opens → fetch(photo.src)
                 → parseExifFromBuffer()
                 → display camera metadata
```

## Component Responsibilities

| Component | Responsibility | Rendering |
|-----------|----------------|-----------|
| `page.tsx` | Photo data fetching, layout composition | Server |
| `StickyHeader` | Scroll-aware header animation | Client |
| `PhotoGallery` | Photo shuffling, lightbox state | Client |
| `PhotoCard` | Lazy loading, intersection observer | Client |
| `Lightbox` | Fullscreen view, keyboard nav, EXIF | Client |
| `Footer` | Static footer | Server |

## Key Patterns

### 1. Server/Client Split
- Photo file discovery happens at build/request time (server)
- Interactive features use "use client" directive

### 2. Progressive Loading
- IntersectionObserver for scroll-triggered animations
- Image loading states with opacity transitions

### 3. EXIF Parsing
- Custom binary parser (no external dependencies)
- Parses JPEG APP1 segment directly from ArrayBuffer
- Handles both big-endian and little-endian formats
