# Contributing Guide

## Development Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd prizm-photo-album
npm install
```

### Running Locally

```bash
npm run dev
```

Visit http://localhost:3000

## Adding Photos

1. Add images to `public/photos/`
2. Supported formats: JPG, JPEG, PNG, WebP
3. Photos are auto-discovered on page load

## Code Style

- TypeScript with strict mode
- ESLint with Next.js config
- Tailwind CSS for styling

### Linting

```bash
npm run lint
```

## Project Conventions

### File Naming

- Components: PascalCase (`PhotoCard.tsx`)
- Utilities: camelCase (`exif.ts`)

### Component Structure

```tsx
"use client"; // if client-side

import { ... } from "...";

interface ComponentProps {
  // props
}

export function Component({ ... }: ComponentProps) {
  // state
  // effects
  // handlers
  // render
}
```

## Building

```bash
npm run build
```

Production build outputs to `.next/`

## Deployment

Standard Next.js deployment. Compatible with:
- Vercel
- Self-hosted Node.js
- Static export (with configuration)
