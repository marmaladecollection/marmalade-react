"use client";

import styles from "./blurb.module.scss";

function parseTextWithTooltips(text) {
  if (!text) return null;
  
  const parts = text.split(/(\[[^|]+\|[^\]]+\])/);
  
  return parts.map((part, index) => {
    const match = part.match(/\[([^|]+)\|([^\]]+)\]/);
    if (match) {
      const [, text, description] = match;
      return (
        <span key={index} className={styles.highlightedText}>
          {text}
          <span className={styles.tooltip}>{description}</span>
        </span>
      );
    }
    return part;
  });
}

export default function Blurb({ item }) {
  return (
    <div className={styles.productBlurb}>
      <p>
        {parseTextWithTooltips(item.blurb)}
      </p>
      <div className={styles.details}>
        <h4>Dimensions</h4>
        {item.dimensions}
      </div>
    </div>
  );
}
