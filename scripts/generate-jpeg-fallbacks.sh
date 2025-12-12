#!/bin/bash

# Generate JPEG fallback images from WebP files
# Converts all WebP images to JPEG format with lower quality (70-75%) for older browsers
# Always overwrites existing JPEGs to keep them in sync with WebP files

set -e

IMAGES_DIR="public/images"
JPEG_QUALITY=65  # Lower quality to keep file sizes similar to WebP

echo "🖼️  Generating JPEG images from WebP sources..."
echo "JPEG quality: ${JPEG_QUALITY}% (optimized for similar file sizes to WebP)"
echo ""

# Counter for processed images
count=0
total_webp_size=0
total_jpeg_size=0

# Process all webp files in the images directory (excluding subdirectories)
for webp_file in "$IMAGES_DIR"/*.webp; do
    # Skip if no files found
    [ -e "$webp_file" ] || continue
    
    filename=$(basename "$webp_file" .webp)
    jpeg_file="$IMAGES_DIR/${filename}.jpg"
    
    # Get WebP file size
    webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
    webp_kb=$((webp_size / 1024))
    total_webp_size=$((total_webp_size + webp_size))
    
    echo "Converting: ${filename}.webp (${webp_kb}KB) → ${filename}.jpg"
    
    # Convert WebP to JPEG: strip metadata, set quality, always overwrite
    magick "$webp_file" \
        -strip \
        -quality $JPEG_QUALITY \
        "$jpeg_file"
    
    # Get JPEG file size
    jpeg_size=$(stat -f%z "$jpeg_file" 2>/dev/null || stat -c%s "$jpeg_file" 2>/dev/null)
    jpeg_kb=$((jpeg_size / 1024))
    total_jpeg_size=$((total_jpeg_size + jpeg_size))
    
    echo "  ✓ Created ${filename}.jpg (${jpeg_kb}KB)"
    echo ""
    
    count=$((count + 1))
done

# Summary
total_webp_mb=$((total_webp_size / 1024 / 1024))
total_jpeg_mb=$((total_jpeg_size / 1024 / 1024))

echo "======================================"
echo "✅ JPEG generation complete!"
echo "Images processed: $count"
echo "Total WebP size: ${total_webp_mb}MB"
echo "Total JPEG size: ${total_jpeg_mb}MB"
echo "======================================"

