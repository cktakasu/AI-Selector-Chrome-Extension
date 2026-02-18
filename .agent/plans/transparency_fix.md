# Implementation Plan - Transparency and Tighter Layout

The goal is to make the extension popup appear as if only the icons and "NEW" badges are present by removing the visible frame, background, and extra spacing.

## Proposed Changes

### 1. `src/App.tsx`
- Remove all padding and background effects.
- Ensure the main container is just a wrapper for the grid.

### 2. `src/components/LinkGrid.tsx`
- Tighten the gap and padding.

### 3. `src/components/LinkCard.tsx`
- Ensure the "New" badge is visible even with tight containers.
- If the container is too tight, the `-top-2` might cut off. I'll add a small padding to the `main` or `LinkGrid` to accommodate the badges.

## Verification Plan

### Manual Verification
- Check the extension popup in Chrome.
- Verify that there is no visible white/gray box around the icons.
- Verify that the "NEW" badges are not clipped.
