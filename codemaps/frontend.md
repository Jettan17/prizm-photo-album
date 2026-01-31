# Frontend Architecture

Last updated: 2026-01-31

**Live:** [prizm-photo-album.vercel.app](https://prizm-photo-album.vercel.app)

## Component Tree

```
App (layout.tsx)
└── main
    ├── StickyHeader
    │   ├── Expanded view (title, author, handle)
    │   └── Collapsed view (compact title + author)
    ├── PhotoGallery
    │   ├── PhotoCard (x N)
    │   └── Lightbox (conditional)
    │       ├── Close button
    │       ├── Zoom toggle button
    │       ├── Info toggle button
    │       ├── Navigation buttons (prev/next)
    │       ├── Image viewer (with zoom/pan)
    │       └── EXIF panel
    │           ├── Location (with pin icon)
    │           ├── Date (with calendar icon)
    │           ├── Camera (with camera icon)
    │           ├── Lens model
    │           └── Technical specs (focal, aperture, shutter, ISO, EV)
    └── Footer
```

## State Management

### Local State (useState)

| Component | State | Purpose |
|-----------|-------|---------|
| StickyHeader | `isScrolled` | Header collapse state |
| PhotoGallery | `shuffledPhotos` | Randomized photo order |
| PhotoGallery | `lightboxIndex` | Currently open photo |
| PhotoCard | `isLoaded`, `isVisible` | Loading/animation state |
| Lightbox | `exifData` | Extracted EXIF metadata |
| Lightbox | `location` | Reverse geocoded location |
| Lightbox | `showInfo` | Toggle info panel visibility |
| Lightbox | `zoomLevel` | Current zoom (1x-3x) |
| Lightbox | `panPosition` | Pan offset when zoomed |
| Lightbox | `isDragging` | Active drag state |

### Refs (useRef)

| Component | Ref | Purpose |
|-----------|-----|---------|
| StickyHeader | `lastScrollY` | Scroll direction detection |
| PhotoCard | `ref` | IntersectionObserver target |
| Lightbox | `imageContainerRef` | Pan boundary calculations |
| Lightbox | `dragStart` | Mouse/touch drag start position |
| Lightbox | `lastPanPosition` | Pan position before drag |
| Lightbox | `lastTapTime` | Double-tap detection |
| Lightbox | `initialPinchDistance` | Pinch zoom start distance |
| Lightbox | `initialPinchZoom` | Zoom level at pinch start |

## EXIF Data Interface

```typescript
interface ExifData {
  dateTaken?: string;        // "Jan 15, 2025"
  camera?: string;           // "Canon EOS R5"
  lensModel?: string;        // "RF 50mm F1.2L USM"
  focalLength?: string;      // "50mm"
  focalLength35mm?: number;  // 75 (for crop sensors)
  aperture?: string;         // "f/1.2"
  shutterSpeed?: string;     // "1/250s"
  iso?: number;              // 400
  exposureBias?: string;     // "+0.7 EV"
  latitude?: number;         // 37.7749
  longitude?: number;        // -122.4194
}
```

## Styling Strategy

### Tailwind Classes

- **Layout**: `columns-1 sm:columns-2 lg:columns-3 xl:columns-4`
- **Animations**: Custom `scroll-reveal` class with stagger delays
- **Transitions**: `transition-all duration-300 ease-out`
- **Header height**: `h-[112px]` → `h-[48px]` on scroll (mobile: 96px → 40px)

### Custom CSS (globals.css)

```css
/* Scroll reveal animation */
.scroll-reveal { opacity: 0; transform: translateY(20px); }
.scroll-reveal.visible { opacity: 1; transform: translateY(0); }

/* Stagger delays */
.stagger-1 { transition-delay: 0ms; }
.stagger-2 { transition-delay: 75ms; }
.stagger-3 { transition-delay: 150ms; }
.stagger-4 { transition-delay: 225ms; }
```

## Responsive Breakpoints

| Breakpoint | Columns | Width |
|------------|---------|-------|
| Default | 1 | < 640px |
| `sm` | 2 | >= 640px |
| `lg` | 3 | >= 1024px |
| `xl` | 4 | >= 1280px |

## Image Optimization

- Next.js `<Image>` component for automatic optimization
- Responsive `sizes` attribute for appropriate image selection
- Lazy loading via intersection observer
- AVIF/WebP conversion on Vercel CDN

## Lightbox Zoom & Pan

### Controls

| Input | Action |
|-------|--------|
| Zoom button | Toggle 1x ↔ 2x |
| 'z' key | Toggle 1x ↔ 2x |
| Double-tap (mobile) | Toggle 1x ↔ 2x |
| Pinch (mobile) | Continuous zoom 1x-3x |
| Mouse drag (zoomed) | Pan image |
| Touch drag (zoomed) | Pan image |

### Behavior

- **Zoom range**: 1x (fit) to 3x (maximum)
- **Snap points**: Pinch snaps to 1x or 2x on release
- **Pan constraints**: Image edges cannot leave viewport
- **Navigation lock**: Swipe disabled when zoomed (prevents accidental changes)
- **Reset on navigate**: Zoom returns to 1x when changing photos
- **Cursor feedback**: `cursor-grab` when zoomed, `cursor-grabbing` while dragging

## External API Integration

### BigDataCloud Reverse Geocoding

```typescript
// Called when GPS coordinates exist in EXIF
const location = await reverseGeocode(lat, lng);
// Returns: "San Francisco, United States"
```

**Caching strategy:**
1. Check memory cache (Map)
2. Check sessionStorage
3. Fetch from API if miss
4. Cache result in both layers
