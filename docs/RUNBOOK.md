# Runbook

## Quick Start

```bash
npm install
npm run dev
```

## Common Tasks

### Add New Photos

1. Copy images to `public/photos/`
2. Refresh the page

### Change Album Title

Edit `src/app/page.tsx`:

```tsx
<StickyHeader
  title="Your Title"
  author="Your Name"
  handle="@your_handle"
/>
```

### Adjust Header Animation

Edit `src/components/StickyHeader.tsx`:

- Expanded height: `h-[100px]`
- Collapsed height: `h-[48px]`
- Scroll threshold: `currentY > 100` (down) / `currentY < 50` (up)

### Modify Gallery Columns

Edit `src/components/PhotoGallery.tsx`:

```tsx
<div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
```

## Troubleshooting

### Photos Not Showing

1. Check files are in `public/photos/`
2. Check file extensions (jpg, jpeg, png, webp only)
3. Check console for errors

### EXIF Data Not Displaying

- Only JPEG files contain EXIF data
- PNG/WebP files won't show camera info
- Some JPEGs may have stripped metadata

### Build Errors

```bash
# Clean and rebuild
rm -rf .next
npm run build
```

### Type Errors

```bash
npm run lint
```

## Performance Notes

- Large images are optimized by Next.js
- EXIF parsing happens client-side (on-demand)
- Photos lazy-load as you scroll

## Deployment Checklist

1. Run `npm run build` locally
2. Verify build succeeds
3. Test production build with `npm start`
4. Deploy to hosting platform
