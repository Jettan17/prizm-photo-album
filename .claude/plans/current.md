# Implementation Plan: Fix Logo Centering and Improve Spectrum Rays

Created: 2026-01-30
Status: completed
Completed: 2026-01-30

## Requirements

1. **Center the logo image**: The prism + text combination should be horizontally centered within the SVG, so when the image is displayed centered in the header, it appears properly balanced.

2. **Improve spectrum rays realism**: Replace simple colored lines with more realistic light beam effects:
   - Gradient fading (bright at source, fading outward)
   - Soft glow/blur effects
   - Varying beam widths (wider as they spread)
   - Slight transparency for light-like appearance

## Implementation Phases

### Phase 1: Recalculate Logo Layout for Centering
- [x] Calculate total content width (prism + gap + text)
- [x] Determine offset to center content in viewBox
- [x] Shift all elements by the offset amount using `<g transform="translate(20, 0)">`

### Phase 2: Create Realistic Spectrum Ray Effects
- [x] Create gradient definitions for each color that fade from bright to transparent
- [x] Replace lines with tapered polygons (narrow at prism, wider at end)
- [x] Add blur filter (`feGaussianBlur`) for soft glow effect
- [x] Add secondary "glow" layer behind main rays with stronger blur
- [x] Adjust opacity and blending for light-like appearance

### Phase 3: Update Favicon Icon
- [x] Apply spectrum ray improvements to `src/app/icon.svg`
- [x] Used simpler glow (stdDeviation=0.8) for clarity at small sizes

### Phase 4: Update Apple Icon
- [x] Apply same improvements to `src/app/apple-icon.tsx`

## Files Modified

- `public/logo.svg` - Centered layout, realistic spectrum rays with gradients and glow
- `src/app/icon.svg` - Updated with gradient rays and subtle glow
- `src/app/apple-icon.tsx` - Updated with matching effects

## Technical Implementation

### Centering Solution
Used `<g transform="translate(20, 0)">` to shift all content right by 20px, centering the ~160px content in the 200px viewBox.

### Spectrum Ray Improvements
1. **Fading gradients**: Each ray color has its own gradient (bright → transparent)
2. **Tapered polygons**: Rays are wider at the far end, narrower at the prism
3. **Dual glow layers**:
   - Background layer: `feGaussianBlur stdDeviation="3"` at 40% opacity for ambient light
   - Foreground layer: `feGaussianBlur stdDeviation="1.5"` merged with source for crisp glow
4. **5 spectrum colors**: Red, Orange, Teal, Blue, Purple
