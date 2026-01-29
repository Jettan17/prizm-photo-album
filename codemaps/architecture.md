# Architecture Overview

Last updated: 2026-01-29

**Live:** [prizm-photo-album.vercel.app](https://prizm-photo-album.vercel.app)

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
│  │       └── reverseGeocode() → BigDataCloud API        │
│  └── Footer                                             │
├─────────────────────────────────────────────────────────┤
│  lib/                                                   │
│  ├── photos.ts - Imports build-time manifest            │
│  └── exif.ts - Binary EXIF parsing + geocoding          │
├─────────────────────────────────────────────────────────┤
│  scripts/                                               │
│  └── generate-photos.js - Build-time manifest generator │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    External APIs                        │
├─────────────────────────────────────────────────────────┤
│  BigDataCloud (reverse geocoding)                       │
│  - Free, no API key required                            │
│  - Returns city + country from lat/lng                  │
│  - Cached in sessionStorage                             │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. Build time:
   generate-photos.js → scans public/photos/
                      → writes photos-manifest.json

2. Server-side (page render):
   page.tsx → imports photos-manifest.json
           → passes Photo[] to PhotoGallery

3. Client-side (lightbox open):
   Lightbox → fetch(photo.src)
           → parseExifFromBuffer()
           → extract camera info + GPS coordinates

4. Reverse geocoding (if GPS exists):
   reverseGeocode(lat, lng) → check sessionStorage cache
                            → if miss: fetch BigDataCloud API
                            → cache result
                            → display "City, Country"
```

## Component Responsibilities

| Component | Responsibility | Rendering |
|-----------|----------------|-----------|
| `page.tsx` | Import manifest, layout composition | Server |
| `StickyHeader` | Scroll-aware header animation (100px→48px) | Client |
| `PhotoGallery` | Photo shuffling, lightbox state | Client |
| `PhotoCard` | Lazy loading, intersection observer | Client |
| `Lightbox` | Fullscreen view, keyboard nav, EXIF, geocoding | Client |
| `Footer` | Static footer | Server |

## Key Patterns

### 1. Build-Time Photo Discovery
- Photos discovered at build time (not runtime)
- Avoids bundling 560MB of photos into serverless function
- Manifest is a small JSON file (~2KB)

### 2. Server/Client Split
- Photo manifest imported statically (server)
- Interactive features use "use client" directive

### 3. Progressive Loading
- IntersectionObserver for scroll-triggered animations
- Image loading states with opacity transitions

### 4. Custom EXIF Parser
- No external dependencies
- Parses JPEG APP1 segment from ArrayBuffer
- Handles both big-endian and little-endian formats
- Extracts: date, camera, lens, focal length, aperture, shutter, ISO, exposure bias, GPS

### 5. GPS + Reverse Geocoding
- GPS stored as degrees/minutes/seconds → converted to decimal
- BigDataCloud API for city/country lookup
- Two-level caching: memory Map + sessionStorage
