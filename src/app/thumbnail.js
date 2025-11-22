"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './thumbnail.module.scss';

export default function Thumbnail({ item, allowCycling = false, onImageClick, priority = false }) {
  // Force cache busting with version parameter (increment when images are updated)
  const cacheVersion = 'v2'; // Change this number when you update images to force cache clearing

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Initialize immediately with main image to prevent flash of wrong image
  const [availableImages, setAvailableImages] = useState([`/images/${item.id}.webp?${cacheVersion}`]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  useEffect(() => {
    // Reset image loaded state when item changes
    setIsImageLoaded(false);
    setIsLoadingImages(true);
    setCurrentImageIndex(0); // Reset to first image
    
    console.log('[Thumbnail] Starting image discovery for item:', item.id);

    const loadAvailableImages = async () => {
      if (allowCycling) {
        // Start with the base image
        const images = [`/images/${item.id}.webp?${cacheVersion}`];
        console.log('[Thumbnail] Base image added:', images[0]);

        // Check images sequentially using Image.decode() for better reliability
        for (let i = 1; i <= 10; i++) {
          const imagePath = `/images/${item.id}-${i}.webp?${cacheVersion}`;
          
          try {
            // Create an actual Image object to test if it loads
            const img = new window.Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = imagePath;
            });
            // Image loaded successfully, add it
            images.push(imagePath);
            console.log('[Thumbnail] Image', i, 'loaded successfully:', imagePath);
          } catch {
            // Image doesn't exist or failed to load, skip it
            console.log('[Thumbnail] Image', i, 'failed to load, skipping:', imagePath);
            continue;
          }
        }

        console.log('[Thumbnail] Final available images:', images.length, images);
        setAvailableImages(images);
      } else {
        // Single image mode
        setAvailableImages([`/images/${item.id}.webp?${cacheVersion}`]);
      }

      setIsLoadingImages(false);
      console.log('[Thumbnail] Image loading complete');
    };

    loadAvailableImages();
  }, [item.id, allowCycling, cacheVersion]);

  // Get current image src - if the requested image doesn't exist yet, show the main image
  const currentImageSrc = availableImages[currentImageIndex] || `/images/${item.id}.webp?${cacheVersion}`;
  
  console.log('[Thumbnail] Render state:', {
    currentImageIndex,
    availableImagesLength: availableImages.length,
    currentImageSrc,
    isLoadingImages
  });

  // Reset loading state when the displayed image changes
  useEffect(() => {
    setIsImageLoaded(false);
    
    // Fallback for cached images: if onLoad doesn't fire (cached images load instantly),
    // show the image after a brief delay
    const timeout = setTimeout(() => {
      setIsImageLoaded(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, [currentImageSrc]);

  const handlePrevious = () => {
    console.log('[Thumbnail] Previous clicked', {
      availableImagesCount: availableImages.length,
      currentIndex: currentImageIndex,
      availableImages: availableImages
    });
    
    // Don't allow navigation if only one image is available
    if (availableImages.length <= 1) {
      console.log('[Thumbnail] Navigation blocked - only one image available');
      return;
    }

    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? availableImages.length - 1 : prev - 1;
      console.log('[Thumbnail] Previous: changing index from', prev, 'to', newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    console.log('[Thumbnail] Next clicked', {
      availableImagesCount: availableImages.length,
      currentIndex: currentImageIndex,
      availableImages: availableImages
    });
    
    // Don't allow navigation if only one image is available
    if (availableImages.length <= 1) {
      console.log('[Thumbnail] Navigation blocked - only one image available');
      return;
    }

    setCurrentImageIndex((prev) => {
      const newIndex = prev === availableImages.length - 1 ? 0 : prev + 1;
      console.log('[Thumbnail] Next: changing index from', prev, 'to', newIndex);
      return newIndex;
    });
  };

  return (
    <div className={styles.container}>
      {!isImageLoaded && (
        <div className={styles.skeleton} />
      )}
      <Image
        className={styles.backgroundImage}
        src={availableImages[0] || `/images/${item.id}.webp?${cacheVersion}`}
        alt={item.name}
        width={350}
        height={470}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
        priority={priority}
        onLoad={() => setIsImageLoaded(true)}
        onError={() => setIsImageLoaded(true)} // Show image even if there's an error
        style={{ width: '100%', height: 'auto' }}
      />
      <Image
        className={styles.overlayImage}
        src={currentImageSrc}
        alt={item.name}
        width={350}
        height={470}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
        priority={priority}
        onLoad={() => setIsImageLoaded(true)}
        onError={() => setIsImageLoaded(true)} // Show image even if there's an error
        onClick={onImageClick ? () => onImageClick(currentImageSrc, item.name) : undefined}
        style={{
          opacity: isImageLoaded ? 1 : 0,
          width: 'auto',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
      {allowCycling && availableImages.length > 1 && (
        <>
          <button className={styles.navButton} onClick={handlePrevious} aria-label="Previous image">
            <span className={styles.navButtonHitbox}></span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={styles.navButton} onClick={handleNext} aria-label="Next image">
            <span className={styles.navButtonHitbox}></span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {isLoadingImages && (
            <div className={styles.loadingIndicator}>
              <div className={styles.loadingDot}></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
