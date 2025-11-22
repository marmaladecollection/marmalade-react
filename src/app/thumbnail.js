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
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    // Reset image loaded state when item changes
    setIsImageLoaded(false);
    setIsLoadingImages(true);

    const loadAvailableImages = async () => {
      if (allowCycling) {
        // Start with the base image
        const images = [`/images/${item.id}.webp?${cacheVersion}`];

        // Then try to find numbered variants by checking if they exist
        let index = 1;
        let consecutiveFailures = 0;
        const maxFailures = 3; // Stop after 3 consecutive missing images

        // Try to find numbered variants by checking if they exist
        // Use a more reliable method that works in both local and deployed environments
        for (let i = 1; i <= 10; i++) {
          const imagePath = `/images/${item.id}-${i}.webp?${cacheVersion}`;
          images.push(imagePath);
        }

        setAvailableImages(images);
      } else {
        // Single image mode
        setAvailableImages([`/images/${item.id}.webp?${cacheVersion}`]);
      }

      setIsLoadingImages(false);
    };

    loadAvailableImages();
  }, [item.id, allowCycling, cacheVersion]);

  // Get valid images (excluding failed ones)
  const validImages = getValidImages();

  // Get current image src - if the requested image doesn't exist yet, show the main image
  const currentImageSrc = validImages[currentImageIndex] || `/images/${item.id}.webp?${cacheVersion}`;

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

  const handleImageError = (imageSrc) => {
    // Mark this image as failed and remove it from available images
    setFailedImages(prev => new Set([...prev, imageSrc]));
  };

  const getValidImages = () => {
    return availableImages.filter(img => !failedImages.has(img));
  };

  const handlePrevious = () => {
    const validImages = getValidImages();
    // Don't allow navigation if only one valid image is available
    if (validImages.length <= 1) return;

    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? validImages.length - 1 : prev - 1;
      return newIndex;
    });
  };

  const handleNext = () => {
    const validImages = getValidImages();
    // Don't allow navigation if only one valid image is available
    if (validImages.length <= 1) return;

    setCurrentImageIndex((prev) => {
      const newIndex = prev === validImages.length - 1 ? 0 : prev + 1;
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
        src={validImages[0] || `/images/${item.id}.webp?${cacheVersion}`}
        alt={item.name}
        width={350}
        height={470}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
        priority={priority}
        onLoad={() => setIsImageLoaded(true)}
        onError={() => {
          handleImageError(validImages[0] || `/images/${item.id}.webp?${cacheVersion}`);
          setIsImageLoaded(true); // Still show the component even if image fails
        }}
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
        onError={() => {
          handleImageError(currentImageSrc);
          setIsImageLoaded(true); // Still show the component even if image fails
        }}
        onClick={onImageClick ? () => onImageClick(currentImageSrc, item.name) : undefined}
        style={{
          opacity: isImageLoaded ? 1 : 0,
          width: 'auto',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
      {allowCycling && validImages.length > 1 && (
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

