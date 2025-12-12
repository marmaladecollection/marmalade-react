// Simple modal for image zoom
import { useEffect, useState } from "react";
import styles from "./ImageZoomModal.module.scss";

export default function ImageZoomModal({ src, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Extract base name from src (e.g., "/images/item-id.webp?v16" -> "item-id")
  // Handle both .webp and .jpg extensions, and query strings
  const getBaseName = (imageSrc) => {
    // Remove query string if present
    const pathWithoutQuery = imageSrc.split('?')[0];
    // Extract filename from path
    const filename = pathWithoutQuery.split('/').pop();
    // Remove extension (.webp or .jpg)
    return filename.replace(/\.(webp|jpg|jpeg)$/i, '');
  };

  const baseName = getBaseName(src);
  const queryString = src.includes('?') ? src.substring(src.indexOf('?')) : '';
  const webpSrc = `/images/${baseName}.webp${queryString}`;
  const jpegSrc = `/images/${baseName}.jpg${queryString}`;

  return (
    <div className={styles.modal} onClick={onClose}>
      {!imageLoaded && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={jpegSrc}
          alt="Zoomed view"
          className={styles.image}
          onLoad={() => setImageLoaded(true)}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      </picture>
      <button
        className={styles.close}
        aria-label="Close zoom"
        onClick={onClose}
      >×</button>
    </div>
  );
}
