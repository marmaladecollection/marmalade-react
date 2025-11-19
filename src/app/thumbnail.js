"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './thumbnail.module.scss';

export default function Thumbnail({ item, allowCycling = false, onImageClick, priority = false }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableImages, setAvailableImages] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      if (allowCycling) {
        // Start with the base image
        const images = [`/images/${item.id}.webp`];

        // Then look for numbered variants
        let index = 1;
        let hasMoreImages = true;

        while (hasMoreImages) {
          const imagePath = `/images/${item.id}-${index}.webp`;
          try {
            // Try to load the image
            const img = new window.Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = imagePath;
            });
            images.push(imagePath);
            index++;
          } catch (error) {
            hasMoreImages = false;
          }
        }
        setAvailableImages(images);
      } else {
        // Single image mode
        setAvailableImages([`/images/${item.id}.webp`]);
      }
    };

    loadImages();
  }, [item.id, allowCycling]);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? availableImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === availableImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.container}>
      {!isImageLoaded && (
        <div className={styles.skeleton} />
      )}
      <Image
        className={styles.backgroundImage}
        src={availableImages[0] || `/images/${item.id}.webp`}
        alt={item.name}
        width={350}
        height={470}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
        priority={priority}
        onLoad={() => setIsImageLoaded(true)}
        style={{ width: '100%', height: 'auto' }}
      />
      <Image
        className={styles.overlayImage}
        src={availableImages[currentImageIndex] || `/images/${item.id}.webp`}
        alt={item.name}
        width={350}
        height={470}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
        priority={priority}
        onClick={onImageClick ? () => onImageClick(availableImages[currentImageIndex], item.name) : undefined}
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
        </>
      )}
    </div>
  );
}

