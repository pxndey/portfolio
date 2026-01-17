# Server Images Directory

This directory contains images for the server carousel on the Misc page.

## How to Add More Images

1. **Add your image files** to this directory with sequential names:
   - `server-1.jpg` (already exists)
   - `server-2.jpg` (your new image)
   - `server-3.jpg` (another new image)
   - etc.

2. **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.webp`

3. **Update the Misc.tsx file** to import the new images:
   ```tsx
   // In src/pages/Misc.tsx, add new imports:
   import serverImage1 from '../assets/server-images/server-1.jpg'
   import serverImage2 from '../assets/server-images/server-2.jpg'  // <- Add this
   import serverImage3 from '../assets/server-images/server-3.jpg'  // <- Add this

   // Then add them to the array:
   const serverImages = [
     serverImage1,
     serverImage2,  // <- Uncomment or add this
     serverImage3,  // <- Uncomment or add this
   ]
   ```

4. **Optimize your images** before adding them:
   - Recommended max width: 1400px
   - Use JPEG with 80-85% quality for photos
   - File size should ideally be under 500KB per image

5. **The carousel will automatically**:
   - Show navigation arrows if there are 2+ images
   - Show dots/indicators for each image
   - Allow clicking dots to jump to specific images
