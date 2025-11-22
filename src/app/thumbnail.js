"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './thumbnail.module.scss';

export default function Thumbnail({ item, allowCycling = false, onImageClick, priority = false }) {
  // Force cache busting with version parameter (increment when images are updated)
  const cacheVersion = 'v3'; 

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Initialize with just the main image
  const [availableImages, setAvailableImages] = useState([`/images/${item.id}.webp?${cacheVersion}`]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const discoveryStarted = useRef(false);

  useEffect(() => {
    // Reset state when item changes
    setIsImageLoaded(false);
    setCurrentImageIndex(0);
    setAvailableImages([`/images/${item.id}.webp?${cacheVersion}`]);
    discoveryStarted.current = false;
  }, [item.id, cacheVersion]);

  // Image discovery logic
  useEffect(() => {
    if (!allowCycling || discoveryStarted.current) return;
    
    const discoverImages = async () => {
      discoveryStarted.current = true;
      setIsLoadingImages(true);

      // Prepare parallel probes for images 1-10
      const probes = [];
      for (let i = 1; i <= 10; i++) {
        const path = `/images/${item.id}-${i}.webp?${cacheVersion}`;
        const probe = new Promise((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve({ path, exists: true, index: i });
          img.onerror = () => resolve({ path, exists: false, index: i });
          img.src = path;
        });
        probes.push(probe);
      }

      // Run all probes in parallel
      const results = await Promise.all(probes);
      
      // Filter valid images and sort by index
      const validExtras = results
        .filter(r => r.exists)
        .sort((a, b) => a.index - b.index)
        .map(r => r.path);

      if (validExtras.length > 0) {
        setAvailableImages(prev => [...prev, ...validExtras]);
      }
      
      setIsLoadingImages(false);
    };

    discoverImages();
  }, [item.id, allowCycling, cacheVersion]);

  const handlePrevious = () => {
    if (availableImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? availableImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (availableImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === availableImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.container}>
      {!isImageLoaded && (
        <div className={styles.skeleton} />
      )}
      
      {/* Render ALL available images into the DOM to force pre-decoding */}
      {availableImages.map((src, index) => {
        const isVisible = index === currentImageIndex;
        // Only the first few images need high priority to save bandwidth on initial load
        // But we want them all to load eventually
        const isPriority = priority || index <= 1; 
        
        return (
          <div 
            key={src}
            className={styles.imageWrapper}
            style={{ 
              position: isVisible ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              opacity: isVisible ? 1 : 0,
              zIndex: isVisible ? 10 : 1,
              pointerEvents: isVisible ? 'auto' : 'none',
            }}
          >
            <Image
              src={src}
              alt={item.name}
              width={350}
              height={470}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={75} // Optimized quality
              priority={isPriority} // Eager load main images
              loading={isPriority ? "eager" : "lazy"}
              onLoad={() => {
                if (!isImageLoaded) setIsImageLoaded(true);
              }}
              onError={() => {
                if (!isImageLoaded) setIsImageLoaded(true);
              }}
              onClick={onImageClick ? () => onImageClick(src, item.name) : undefined}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        );
      })}

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
