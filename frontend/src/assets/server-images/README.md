# Server Images Directory

This directory contains images for the server carousel on the Misc page.

## How to Add More Images

1. **Add your image files** to this directory with sequential names:
   - `server-2.webp` (your new image)
   - `server-3.webp` (another new image)
   - etc.

2. **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.webp`

3. **Update the Misc.tsx file** to import the new images:
   ```tsx
   // In src/pages/Misc.tsx, add new imports:
   import serverImage1 from '../assets/server-images/Omen.jpeg'
   import serverImage2 from '../assets/server-images/server-2.webp'  // <- Add this
   import serverImage3 from '../assets/server-images/server-3.webp'  // <- Add this

   // Then add them to the array:
   const serverImages = [
     serverImage1,
     serverImage2,  // <- Uncomment or add this
     serverImage3,  // <- Uncomment or add this
   ]
   ```

4. **Optimize your images** before adding them:
   - Render target here is a carousel capped at `--prose-max` wide × 380px tall, so
     resize to ~1100px max width (1.5× DPR) — no need for multi-megapixel source files.
   - Prefer WebP (`cwebp -q 75`) for photos; results here are well under 250KB each.
   - Keep the source resolution modest so the bundle stays lean.

5. **The carousel will automatically**:
   - Show navigation arrows if there are 2+ images
   - Show dots/indicators for each image
   - Allow clicking dots to jump to specific images
