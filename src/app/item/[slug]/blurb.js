"use client";

import React from 'react';
import styles from './blurb.module.scss';

function parseTextWithTooltips(text) {
  if (!text) return null;
  // Use '=' as the separator for both splitting and matching
  const parts = text.split(/(\[[^=]+=[^\]]+\])/);
  return parts.map((part, index) => {
    const match = part.match(/\[([^=]+)=([^\]]+)\]/);
    if (match) {
      const [, text, description] = match;
      return (
        <span key={index} className={styles.highlightedText}>
          {text}
          <span className={styles.tooltip}>{description}</span>
        </span>
      );
    }
    // Always return a React element for text
    return <React.Fragment key={index}>{part}</React.Fragment>;
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
