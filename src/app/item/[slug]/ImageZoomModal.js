// Simple modal for image zoom
import { useEffect } from "react";
import styles from "./ImageZoomModal.module.scss";
import { getCacheBustedSrc } from "../../../utils/imageCacheBuster";

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
      <img
        src={getCacheBustedSrc(src)}
        className={styles.image}
        onClick={e => e.stopPropagation()}
      />
      <button
        className={styles.close}
        aria-label="Close zoom"
        onClick={onClose}
      >×</button>
    </div>
  );
}
