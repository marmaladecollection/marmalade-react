"use client";

import styles from "./conditionreport.module.scss";

export default function ConditionReport({ item }) {
  return (
    <div className={styles.conditionReport}>
      <h4>Condition Report</h4>
      <div className={styles.details}>
        <div className={styles.condition}>
          <span className={styles.label}>Condition:</span>
          <span className={styles.value}>{item.condition || "Good"}</span>
        </div>
        {item.conditionNotes && (
          <div className={styles.notes}>
            <span className={styles.label}>Notes:</span>
            <span className={styles.value}>{item.conditionNotes}</span>
          </div>
        )}
      </div>
    </div>
  );
} 