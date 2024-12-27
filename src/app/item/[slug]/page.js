"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMarmaladeContext } from "../../context/MarmaladeContext";
import { fetchItemById } from "../../firebase";
import styles from "./page.module.css";

export default function ItemPage({params}) {
  const [slug, setSlug] = useState([]);
  const [item, setItem] = useState([]);
  const router = useRouter();
  const { setMessage } = useMarmaladeContext();

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
        <h1>ITEM</h1>
        <h2>{item.name}</h2>
        <button onClick={openBasket}>Add to basket</button>
      </main>
    </div>
  );
}
