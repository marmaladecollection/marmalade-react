// Simple modal for image zoom
import { useEffect } from "react";
import Image from "next/image";
import styles from "./ImageZoomModal.module.scss";

export default function ImageZoomModal({ src, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.imageContainer} onClick={e => e.stopPropagation()}>
        <Image
          src={src}
          alt="Zoomed view"
          className={styles.image}
          fill
          sizes="100vw"
          quality={95}
          priority
        />
      </div>
      <button
        className={styles.close}
        aria-label="Close zoom"
        onClick={onClose}
      >×</button>
    </div>
  );
}
