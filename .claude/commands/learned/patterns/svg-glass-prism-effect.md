---
description: SVG technique for creating realistic 3D glass prism with rainbow sheen
---

# SVG Glass Prism with Rainbow Sheen

Technique for creating a realistic 3D glass prism effect with internal rainbow iridescence using layered SVG gradients and filters.

## Problem

Creating a convincing glass/crystal effect in SVG requires multiple visual layers: transparency, reflections, refraction hints, and subtle color shifts. A flat triangle looks nothing like a prism.

## Solution

Layer multiple gradient-filled polygons with careful opacity and blend ordering:

### 1. Define Gradient Stack

```xml
<!-- Glass surface gradients -->
<linearGradient id="glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9"/>
  <stop offset="50%" style="stop-color:#e8f4fc;stop-opacity:0.7"/>
  <stop offset="100%" style="stop-color:#d0e8f5;stop-opacity:0.5"/>
</linearGradient>

<!-- Side face (darker, more transparent) -->
<linearGradient id="glass-right" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" style="stop-color:#b8d4e8;stop-opacity:0.6"/>
  <stop offset="100%" style="stop-color:#8bb8d4;stop-opacity:0.4"/>
</linearGradient>

<!-- Rainbow sheen (diagonal, low opacity) -->
<linearGradient id="rainbow-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#FF6B6B" stop-opacity="0.3"/>
  <stop offset="15%" stop-color="#FFB347" stop-opacity="0.3"/>
  <!-- ... full spectrum ... -->
  <stop offset="100%" stop-color="#9B6BFF" stop-opacity="0"/>
</linearGradient>
```

### 2. Layer Order (Bottom to Top)

1. **Side faces** - Darker, establish 3D form
2. **Front face** - Main glass surface with highlight gradient
3. **Bottom face** - Subtle depth indicator
4. **Rainbow sheen layers** - Clipped to front face, blurred
5. **Inner reflection** - White gradient for glass highlight
6. **Edge highlights** - Thin white lines for sharp edges

### 3. Clipping for Internal Effects

```xml
<clipPath id="prism-clip">
  <polygon points="8,42 25,8 38,42"/>
</clipPath>

<g clip-path="url(#prism-clip)">
  <polygon points="8,42 25,8 38,42" fill="url(#rainbow-sheen)" filter="url(#sheen-blur)"/>
</g>
```

### 4. Subtle Blur for Realism

```xml
<filter id="sheen-blur" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
</filter>
```

## Example

See `C:\Users\Jethro\Documents\claude-code-projects\prizm-photo-album\public\logo.svg` for complete implementation.

## Key Opacity Values

- **Glass front face**: 0.5-0.9 (bright to dark gradient)
- **Glass side face**: 0.4-0.6 (consistently darker)
- **Rainbow sheen**: 0.2-0.3 (subtle, not overwhelming)
- **Edge highlights**: 0.3-0.6 (crisp but not harsh)
- **Inner reflection**: 0.0-0.4 (fade to transparent)

## When to Use

- Logo design requiring glass/crystal aesthetics
- Light refraction visualization
- Premium/luxury brand imagery
- Any prism or gem iconography

## Related

- CSS glass morphism techniques
- SVG filter effects for blur and glow
- Color theory for rainbow gradients
