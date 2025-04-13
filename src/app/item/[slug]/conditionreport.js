"use client";

import styles from "./conditionreport.module.scss";

export default function ConditionReport({ item }) {
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
            <span className={styles.label}>Details:</span>
            <span className={styles.value}>{item.conditionDetail}</span>
          </div>
        )}
      </div>
    </div>
  );
} 