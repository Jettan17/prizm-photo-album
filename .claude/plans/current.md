# Implementation Plan: Header Height Animation

Created: 2026-01-28
Status: completed
Completed: 2026-01-29

## Requirements

When scrolling down, the header should:
1. Shrink in height (not just swap content)
2. Animate smoothly between expanded and collapsed states

## Current State

- Header has fixed `h-[100px]` container
- Content swaps via opacity/translate
- Height stays constant (no shrinking effect)

## Solution

Animate the container height from `100px` (expanded) to `48px` (collapsed) using CSS transitions.

## Implementation

### Phase 1: Add Height Animation to Header ✓
- [x] Change container from fixed `h-[100px]` to dynamic height
- [x] Expanded: `h-[100px]`
- [x] Collapsed: `h-[48px]`
- [x] Use `transition-all` for smooth animation
- [x] Keep content crossfade as-is

## Technical Approach

```tsx
<div className={`
  relative flex flex-col items-center justify-center overflow-hidden
  transition-all duration-300 ease-out
  ${isScrolled ? "h-[48px]" : "h-[100px]"}
`}>
```

## File Changes

| File | Action |
|------|--------|
| `src/components/StickyHeader.tsx` | Edit |

## TDD Recommended: No

CSS animation change.

---

Run `/run` to execute.
