#!/bin/bash

# Optimize product images for web using ImageMagick
# Resize to max 1500x2000px and compress with WebP quality 85

set -e

IMAGES_DIR="public/images"
MAX_WIDTH=1500
MAX_HEIGHT=2000
QUALITY=85

echo "🖼️  Starting image optimization..."
echo "Target: ${MAX_WIDTH}x${MAX_HEIGHT}px max, WebP quality ${QUALITY}"
echo ""

# Counter for processed images
count=0
total_before=0
total_after=0

# Process all webp files in the images directory (excluding subdirectories)
for img in "$IMAGES_DIR"/*.webp; do
    # Skip if no files found
    [ -e "$img" ] || continue
    
    filename=$(basename "$img")
    
    # Get original size
    before_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
    before_kb=$((before_size / 1024))
    total_before=$((total_before + before_size))
    
    echo "Processing: $filename (${before_kb}KB)"
    
    # Create temporary file
    temp_file="${img}.tmp.webp"
    
    # Optimize: resize, strip metadata, compress
    magick "$img" \
        -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
        -strip \
        -quality $QUALITY \
        "$temp_file"
    
    # Replace original with optimized
    mv "$temp_file" "$img"
    
    # Get new size
    after_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
    after_kb=$((after_size / 1024))
    total_after=$((total_after + after_size))
    
    reduction=$((100 - (after_size * 100 / before_size)))
    echo "  ✓ ${before_kb}KB → ${after_kb}KB (-${reduction}%)"
    echo ""
    
    count=$((count + 1))
done

# Summary
total_before_mb=$((total_before / 1024 / 1024))
total_after_mb=$((total_after / 1024 / 1024))
total_reduction=$((100 - (total_after * 100 / total_before)))

echo "======================================"
echo "✅ Optimization complete!"
echo "Images processed: $count"
echo "Total size before: ${total_before_mb}MB"
echo "Total size after: ${total_after_mb}MB"
echo "Total reduction: ${total_reduction}%"
echo "======================================"

