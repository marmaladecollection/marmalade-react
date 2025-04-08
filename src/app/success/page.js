"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "complete") {
            setStatus("complete");
          } else {
            setStatus("failed");
          }
        })
        .catch(() => {
          setStatus("failed");
        });
    }
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <h1>Processing your payment...</h1>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <h1>Payment Failed</h1>
          <p>Something went wrong with your payment. Please try again.</p>
          <button onClick={() => router.push("/checkout")} className={styles.button}>
            Return to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Thank you for your purchase!</h1>
        <p>Your order has been confirmed.</p>
        <button onClick={() => router.push("/")} className={styles.button}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
} 