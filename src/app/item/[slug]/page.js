"use client";

import styles from "./page.module.css";
import { fetchItemById } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ItemPage({params}) {
  const [slug, setSlug] = useState([]);
  const [item, setItem] = useState([]);
  const router = useRouter();


  useEffect(() => {
    // Access URL parameters using router
    const pathname = window.location.pathname;
    const slugFromPath = pathname.split("/").pop(); // Extract slug from URL path
    setSlug(slugFromPath);
    
    fetchItemById(slugFromPath, setItem);
  }, []);
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>MARAMALADE ITEM PAGE</h1>
        <h2>{item.name}</h2>
      </main>
    </div>
  );
}
