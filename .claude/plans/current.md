# Implementation Plan: Header Full-Width + Footer Attribution + Mobile Review

Created: 2026-01-30
Status: completed
Completed: 2026-01-30

## Requirements

1. **Add "Claude Code" to footer** - Update the footer component to include a "Claude Code" attribution
2. **Extend header to full screen width** - Currently the header is contained within `container mx-auto px-4`, needs to span full viewport width while maintaining centered content
3. **Mobile design code review** - Review all components for mobile responsiveness and fix any issues

## Current State Analysis

### Header (`StickyHeader.tsx`)
- Located inside `<main className="container mx-auto px-4">` which constrains its width
- The header itself uses `sticky top-0 z-40` but is limited by parent container
- Has two states: expanded (100px) and collapsed (48px) based on scroll

### Footer (`Footer.tsx`)
- Simple component with just "Built with Next.js, React & Tailwind CSS"
- Also constrained within the container

### Page Layout (`page.tsx`)
- All content wrapped in `<main className="container mx-auto px-4">`
- This constrains both header and footer to container width (max-width based on breakpoints)

## Implementation Phases

### Phase 1: Restructure Page Layout for Full-Width Header ✓
- [x] Move `<StickyHeader>` outside the container in `page.tsx`
- [x] Keep gallery content inside the container
- [x] Ensure header spans full viewport width with `w-full`
- [x] Maintain centered header content with internal container/padding

### Phase 2: Update Footer with Claude Code Attribution ✓
- [x] Update `Footer.tsx` to include "Claude Code" in the credits
- [x] Keep the existing styling consistent
- [x] Added link to https://claude.ai/code
- [x] Moved footer outside container for full-width consistency

### Phase 3: Mobile Design Code Review ✓
- [x] Review `StickyHeader.tsx` for mobile: 5 issues found
- [x] Review `PhotoCard.tsx` for mobile: 2 issues found
- [x] Review `PhotoGallery.tsx` for mobile: 3 issues found
- [x] Review `Lightbox.tsx` for mobile: 7 issues found (CRITICAL)
- [x] Review `Footer.tsx` for mobile: 2 issues found

### Phase 4: Implement Mobile Fixes ✓
- [x] StickyHeader: Responsive text sizing (text-3xl sm:text-4xl md:text-5xl)
- [x] StickyHeader: Responsive padding (py-4 sm:py-6)
- [x] StickyHeader: Responsive heights (h-[80px] sm:h-[100px])
- [x] StickyHeader: Touch-friendly Instagram link (min-h-[44px])
- [x] PhotoCard: Active states for touch feedback
- [x] PhotoCard: Focus-visible styles for accessibility
- [x] PhotoGallery: Responsive gap spacing (gap-2 sm:gap-4)
- [x] Lightbox: Touch swipe navigation support
- [x] Lightbox: Responsive button sizing and positioning
- [x] Lightbox: EXIF panel mobile layout (flex-col, max-h-[40vh], overflow scroll)
- [x] Lightbox: Text truncation for long camera/lens names
- [x] Footer: Responsive padding (py-6 sm:py-12)
- [x] Footer: Touch-friendly link target

## Technical Details

### Full-Width Header Pattern
Current structure:
```tsx
<main className="container mx-auto px-4">
  <StickyHeader ... />  <!-- constrained -->
  <PhotoGallery ... />
  <Footer />
</main>
```

Proposed structure:
```tsx
<>
  <StickyHeader ... />  <!-- full-width -->
  <main className="container mx-auto px-4">
    <PhotoGallery ... />
  </main>
  <Footer />  <!-- full-width for consistency -->
</>
```

### Footer Update
Current: `Built with Next.js, React & Tailwind CSS`
Proposed: `Built with Claude Code, Next.js, React & Tailwind CSS`

Or with a link: `Built with [Claude Code](https://claude.ai/code), Next.js, React & Tailwind CSS`

## Dependencies
- None (pure frontend changes)

## Risks
- **LOW**: Layout restructure could affect scroll behavior - StickyHeader should still work correctly
- **LOW**: Need to verify container widths remain consistent for gallery content
- **MEDIUM**: Mobile review may uncover additional issues requiring fixes

## TDD Recommended: No
**Reason:** These are primarily UI/styling changes and layout restructuring. Visual changes are better validated through manual testing and visual inspection rather than automated tests. The changes don't affect business logic or data processing.

## Files to Modify
1. `src/app/page.tsx` - Restructure layout for full-width header
2. `src/components/Footer.tsx` - Add Claude Code attribution
3. `src/components/StickyHeader.tsx` - Potentially add responsive text sizing (after mobile review)
4. `src/components/Lightbox.tsx` - Potentially improve mobile layout (after mobile review)

---

Run `/run` to execute this plan.
