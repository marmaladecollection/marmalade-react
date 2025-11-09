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

  return (
    <div className={styles.modal} onClick={onClose}>
      {!imageLoaded && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <img
        src={src}
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
      <button
        className={styles.close}
        aria-label="Close zoom"
        onClick={onClose}
      >×</button>
    </div>
  );
}
