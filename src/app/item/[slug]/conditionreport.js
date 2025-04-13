"use client";

import { useState, useEffect } from "react";
import styles from "./conditionreport.module.scss";

export default function ConditionReport({ item }) {
  const [scratchImages, setScratchImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const images = [];
      let i = 1;
      
      while (true) {
        const path = `/images/${item.id}-scratch-${i}.webp`;
        try {
          const response = await fetch(path);
          if (response.ok) {
            images.push(path);
            i++;
          } else {
            break;
          }
        } catch (error) {
          break;
        }
      }
      
      setScratchImages(images);
    };

    if (item?.id) {
      loadImages();
    }
  }, [item?.id]);

  // Only render if there's condition data
  if (!item?.condition && !item?.conditionDetail) {
    return null;
  }

  return (
    <div className={styles.conditionReport}>
      <h4>Condition Report</h4>
      <div className={styles.details}>
        {item?.condition && (
          <div className={styles.condition}>
            <span className={styles.label}>Condition:</span>
            <span className={styles.value}>{item.condition}</span>
          </div>
        )}
        {item?.conditionDetail && (
          <div className={styles.notes}>
            <span className={styles.value}>{item.conditionDetail}</span>
          </div>
        )}
      </div>
      {scratchImages.length > 0 && (
        <div className={styles.scratchGallery}>
          {scratchImages.map((src, index) => (
            <img 
              key={index} 
              src={src} 
              alt={`Scratch detail ${index + 1}`}
              className={styles.scratchImage}
            />
          ))}
        </div>
      )}
    </div>
  );
} 