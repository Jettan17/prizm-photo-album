# Implementation Plan: Enhanced EXIF with Location

Created: 2026-01-29
Status: completed
Completed: 2026-01-29

## Requirements

Add high-value EXIF attributes to photo info display:
1. **Lens Model** - Specific lens used
2. **Exposure Compensation** - +/- EV adjustments
3. **35mm Equivalent Focal Length** - For crop sensor context
4. **Location** - Reverse geocode GPS coordinates to city/country

## Implementation Phases

### Phase 1: Extract Additional EXIF Tags ✓
- [x] Add to ExifData interface: `lensModel`, `exposureBias`, `focalLength35mm`
- [x] Extract LensModel (tag 0xA434) from EXIF IFD
- [x] Extract ExposureBiasValue (tag 0x9204) - format as "+0.7 EV"
- [x] Extract FocalLengthIn35mmFilm (tag 0xA405)

### Phase 2: Extract GPS Coordinates ✓
- [x] Add `latitude`, `longitude` to ExifData interface
- [x] Parse GPS IFD (tag 0x8825 points to it)
- [x] Extract GPSLatitudeRef (0x0001) + GPSLatitude (0x0002)
- [x] Extract GPSLongitudeRef (0x0003) + GPSLongitude (0x0004)
- [x] Convert DMS (degrees/minutes/seconds) to decimal

### Phase 3: Reverse Geocoding ✓
- [x] Add `location` string to ExifData interface
- [x] Use free reverse geocoding API (BigDataCloud)
- [x] Extract city + country from response
- [x] Cache results to avoid repeated API calls
- [x] Handle missing/failed geocoding gracefully

### Phase 4: Update Lightbox Display ✓
- [x] Display lens model with camera icon or separate
- [x] Display exposure bias (only if non-zero)
- [x] Display 35mm equivalent (only if different from actual)
- [x] Display location with pin icon

## Technical Details

### GPS Coordinate Conversion
GPS is stored as rational arrays: `[degrees, minutes, seconds]`
```
decimal = degrees + (minutes / 60) + (seconds / 3600)
if (ref === 'S' || ref === 'W') decimal = -decimal
```

### Reverse Geocoding API Options

| API | Free Tier | Rate Limit |
|-----|-----------|------------|
| BigDataCloud | Unlimited | 1 req/sec |
| Nominatim | Free | 1 req/sec |
| OpenCage | 2,500/day | - |

**Recommendation:** BigDataCloud - no API key needed, returns clean city/country.

```
https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lng}&localityLanguage=en
```

### Caching Strategy
Store geocoded locations in sessionStorage to avoid re-fetching:
```typescript
const cacheKey = `geo_${lat.toFixed(4)}_${lng.toFixed(4)}`;
```

## File Changes

| File | Action |
|------|--------|
| `src/lib/exif.ts` | Add GPS + new tag extraction |
| `src/components/Lightbox.tsx` | Display new fields + geocoding |

## Risks

- **MEDIUM**: GPS data may not exist in all photos (iPhone strips it when shared)
- **LOW**: Geocoding API rate limits (mitigated by caching)
- **LOW**: API unavailability (graceful fallback to no location)

## TDD Recommended: No

EXIF parsing and API integration best validated with real photos and manual testing.

---

Run `/run` to execute this plan.
