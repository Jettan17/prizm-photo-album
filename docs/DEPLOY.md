# Deployment Guide

## Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jettan17/prizm-photo-album)

### CLI Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Production deployment:
   ```bash
   vercel --prod
   ```

### Configuration

The `vercel.json` includes:
- **Region**: `iad1` (US East) - change based on your audience
- **Image optimization**: AVIF and WebP formats
- **Caching**: Photos cached for 1 year (immutable)

### Environment Variables

No environment variables required for basic deployment.

### Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

## Build Settings

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

## Performance Notes

### Large Photo Files

This project includes ~560MB of photos in `public/photos/`. On Vercel:
- First deploy may take longer due to file upload
- Images are automatically optimized and cached on CDN
- AVIF/WebP conversion reduces bandwidth significantly

### Recommended Optimizations

For production with many photos:

1. **Use external storage** (Cloudflare R2, AWS S3, Vercel Blob)
2. **Pre-optimize images** before adding to repo
3. **Consider Git LFS** for large binary files

## Preview Deployments

Every push to a non-production branch creates a preview URL:
- `https://prizm-photo-album-<hash>-jettan17.vercel.app`

## Troubleshooting

### Build Timeout

If build times out with large photos:
```bash
# Increase memory limit
vercel --build-env NODE_OPTIONS="--max-old-space-size=4096"
```

### Image Optimization Errors

If images fail to optimize:
1. Check image format (JPG, PNG, WebP supported)
2. Verify file is not corrupted
3. Check Vercel function logs

## Monitoring

Vercel provides built-in analytics:
- **Analytics**: Page views, visitors
- **Speed Insights**: Core Web Vitals
- **Logs**: Function execution logs
