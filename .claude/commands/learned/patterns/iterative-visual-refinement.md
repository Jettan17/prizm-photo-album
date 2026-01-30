---
description: Iterative UI visual refinement workflow for pixel-perfect alignment
---

# Iterative Visual Refinement Pattern

A systematic approach for achieving pixel-perfect visual alignment through small, incremental adjustments.

## Problem

Visual alignment and spacing work often requires many small tweaks that are hard to get right on the first attempt. Elements may appear centered mathematically but look off visually due to optical illusions, varying content widths, or asymmetric shapes.

## Solution

Use a layered adjustment strategy with compensating offsets:

### 1. Container-Level Centering First
```tsx
// Start with standard centering
<div className="flex items-center justify-center gap-3">
```

### 2. Apply Visual Compensation Offsets
When elements have asymmetric visual weight, use negative margins to shift the perceived center:
```tsx
// Shift entire group to compensate for visual imbalance
<div className="flex items-center justify-center gap-3 -ml-3">
  <Image ... />
  <span className="text-neutral-400 leading-none -ml-3">.</span>
  <span className="text-neutral-600">{author}</span>
</div>
```

### 3. Key Techniques
- **Negative margins** (`-ml-3`, `-mt-2`) to shift elements without affecting siblings
- **Leading-none** on inline elements to ensure consistent vertical alignment
- **Gap + negative margin combo** for fine-tuned spacing between specific elements
- **Height constraints** (`h-[40px]`) for predictable transition animations

## Example: Collapsed Header Alignment

The StickyHeader collapsed view needed visual centering compensation:
- Logo + separator + author name in a row
- Logo visually heavier on left side
- Solution: `-ml-3` on container plus `-ml-3` on separator

```tsx
<div className="absolute inset-0 flex items-center justify-center gap-3 -ml-3">
  <Image src="/logo.svg" className="h-5 sm:h-6 w-auto" />
  <span className="text-neutral-400 leading-none -ml-3">.</span>
  <span className="text-neutral-600 text-sm leading-none">{author}</span>
</div>
```

## When to Use

- Aligning logos with text (logos often have asymmetric visual weight)
- Header/footer layouts with mixed content types
- Navigation bars with icons and text
- Any layout where mathematical centering looks visually off
- Animated transitions between layout states (expanded/collapsed)

## Anti-Patterns to Avoid

- Using arbitrary pixel values without reasoning
- Making multiple unrelated changes at once (hard to debug)
- Forgetting responsive variants (apply `-ml-3` but also check `sm:` breakpoint)

## Related

- CSS optical alignment techniques
- SVG logo design with balanced visual weight
- Tailwind arbitrary value syntax for precise adjustments
