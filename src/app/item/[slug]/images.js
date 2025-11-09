"use client";

import Thumbnail from "../../thumbnail";
import { useState } from "react";
import ImageZoomModal from "./ImageZoomModal";
import styles from "./images.module.scss";

export default function Images({ item }) {
  const [zoomSrc, setZoomSrc] = useState(null);

  // Handler to open zoom modal
  const handleZoom = (src) => {
    setZoomSrc(src);
  };

  // Handler to close zoom modal
  const handleCloseZoom = () => setZoomSrc(null);

  return (
    <div className={styles.images}>
      <Thumbnail
        item={item}
        allowCycling={true}
        onImageClick={handleZoom}
        priority={true}
      />
      {zoomSrc && (
        <ImageZoomModal src={zoomSrc} onClose={handleCloseZoom} />
      )}
    </div>
  );
}
