# Implementation Plan: Fix Mobile Button Alignment in Lightbox

Created: 2026-01-31
Status: pending

## Requirements

On mobile, the info button and zoom button are not properly aligned. The current implementation uses absolute positioning with arbitrary `right-` values that don't create consistent spacing.

**Goal:** Group all three buttons (close, zoom, info) together in the top-right corner with consistent spacing.

---

## Current Problem

```
Current positioning:
- Close:  right-2 sm:right-4
- Zoom:   right-14 sm:right-16
- Info:   right-26 sm:right-28  ← "right-26" is not a standard Tailwind class
```

The `right-26` class doesn't exist in Tailwind (it goes 24, 28, 32...), causing inconsistent positioning.

---

## Implementation Phases

### Phase 1: Group Buttons in Flex Container
**File:** `src/components/Lightbox.tsx`

- [ ] **1.1** Create a flex container for the top-right button group
- [ ] **1.2** Position container with `absolute top-2 right-2 sm:top-4 sm:right-4`
- [ ] **1.3** Use `flex gap-1 sm:gap-2` for consistent button spacing
- [ ] **1.4** Move close, zoom, and info buttons into the flex container
- [ ] **1.5** Remove absolute positioning from individual buttons (they inherit from container)
- [ ] **1.6** Order buttons: Info → Zoom → Close (left to right, close always rightmost)

---

## Button Order (Left to Right)

| Position | Button | Reason |
|----------|--------|--------|
| 1 (left) | Info | Least frequently used |
| 2 (middle) | Zoom | Used during viewing |
| 3 (right) | Close | Most important, always rightmost |

---

## Dependencies

- None (CSS-only change)

---

## Risks

- **LOW:** Button order change may confuse existing users briefly

---

## TDD Recommended: No

**Reason:** This is a CSS/layout-only change with no business logic. Visual verification is required.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/Lightbox.tsx` | Wrap buttons in flex container, remove individual absolute positioning |

---

## Expected Result

```jsx
{/* Top-right button group */}
<div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 flex gap-1 sm:gap-2">
  {/* Info button */}
  <button>...</button>
  {/* Zoom button */}
  <button>...</button>
  {/* Close button */}
  <button>...</button>
</div>
```

---

## Testing Checklist

- [ ] All three buttons visible and aligned on mobile (<640px)
- [ ] All three buttons visible and aligned on desktop
- [ ] Buttons have consistent spacing
- [ ] Touch targets remain 44px minimum
- [ ] Buttons don't overlap with navigation arrows
- [ ] Close button remains rightmost

---

## Next Steps

Run `/run` to execute this plan.
