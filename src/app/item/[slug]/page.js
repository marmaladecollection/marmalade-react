"use client";

import styles from "./page.module.css";
import { fetchItemById } from "../../firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMyContext } from "../../context/MyContext";

export default function ItemPage({params}) {
  const [slug, setSlug] = useState([]);
  const [item, setItem] = useState([]);
  const router = useRouter();
  const { setMessage } = useMyContext();

  useEffect(() => {

    const pathname = window.location.pathname;
    const slugFromPath = pathname.split("/").pop(); // Extract slug from URL path
    setSlug(slugFromPath);
    
    fetchItemById(slugFromPath, setItem);
  }, []);
  
  const openBasket = () => {
    setMessage("Item added to basket: " + item.name);
    router.push("/basket");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>MARAMALADE ITEM PAGE</h1>
        <h2>{item.name}</h2>
        <button onClick={openBasket}>Add to basket</button>
      </main>
    </div>
  );
}
