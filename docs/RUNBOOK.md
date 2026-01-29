# Runbook

**Live:** [prizm-photo-album.vercel.app](https://prizm-photo-album.vercel.app)

## Quick Start

```bash
npm install
npm run dev
```

## Common Tasks

### Add New Photos

1. Copy images to `public/photos/`
2. Run `npm run dev` (regenerates manifest automatically)
3. Refresh the page

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

### Customize EXIF Display

Edit `src/components/Lightbox.tsx` to show/hide fields:
- Location (line ~211)
- Date (line ~220)
- Camera (line ~230)
- Lens model (line ~240)
- Technical specs (line ~246)

## Troubleshooting

### Photos Not Showing

1. Check files are in `public/photos/`
2. Check file extensions (jpg, jpeg, png, webp only)
3. Run `node scripts/generate-photos.js` to regenerate manifest
4. Check `src/lib/photos-manifest.json` contains your photos

### EXIF Data Not Displaying

- Only JPEG files contain EXIF data
- PNG/WebP files won't show camera info
- Some JPEGs may have stripped metadata (e.g., shared via social media)

### Location Not Showing

- Photo must have GPS coordinates in EXIF
- iPhone strips GPS when sharing via AirDrop/Messages
- Check browser console for geocoding API errors
- Location is cached in sessionStorage - clear if stale

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

### Vercel Deployment Issues

**Function size too large:**
- Ensure `scripts/generate-photos.js` runs at build time
- Photos should NOT be bundled into serverless function
- Check `prebuild` script in package.json

## Performance Notes

- Large images are optimized by Next.js / Vercel CDN
- EXIF parsing happens client-side (on-demand when lightbox opens)
- Photos lazy-load as you scroll
- Location lookups are cached in sessionStorage

## Deployment Checklist

1. Run `npm run build` locally
2. Verify build succeeds
3. Test production build with `npm start`
4. Push to GitHub (auto-deploys to Vercel)
5. Verify at [prizm-photo-album.vercel.app](https://prizm-photo-album.vercel.app)

## Monitoring

- Vercel Dashboard: Analytics, Speed Insights, Logs
- Check function logs for any server-side errors
- Monitor BigDataCloud API if location stops working
