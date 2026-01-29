# Frontend Architecture

Last updated: 2026-01-29

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
    │       ├── Navigation buttons
    │       ├── Image viewer
    │       └── EXIF panel
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
| Lightbox | `exifData`, `showInfo` | Metadata display |

### Refs (useRef)

| Component | Ref | Purpose |
|-----------|-----|---------|
| StickyHeader | `lastScrollY` | Scroll direction detection |
| PhotoCard | `ref` | IntersectionObserver target |

## Styling Strategy

### Tailwind Classes

- **Layout**: `columns-1 sm:columns-2 lg:columns-3 xl:columns-4`
- **Animations**: Custom `scroll-reveal` class with stagger delays
- **Transitions**: `transition-all duration-300 ease-out`

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
