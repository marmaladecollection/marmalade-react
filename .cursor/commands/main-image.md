Make this image webp format, a consistent file size to the other files, and 4:3 ratio (4 being the height), using minimal cropping.

CRITICAL ORIENTATION REQUIREMENTS:
- Preserve the original image orientation - do NOT accidentally rotate the image
- Always use `-auto-orient` FIRST in the ImageMagick command to respect EXIF orientation metadata
- Verify the output orientation matches the visual orientation of the original image before completing
- The command structure should be: `magick [input] -auto-orient [crop/resize operations] [output]`
- If the original is landscape (wider than tall), the output should remain landscape-oriented
- If the original is portrait (taller than wide), the output should remain portrait-oriented
- Only rotate if the user explicitly requests rotation - never assume rotation is needed