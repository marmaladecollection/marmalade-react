"use client";

import { useEffect, useState } from "react";
import Category from "./category";
import { fetchAllItems } from "./firebase";
import Gallery from "./gallery";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
  }, []);

  return (
    <div>
      <main>
        <Category />
        <Gallery items={items} />
      </main>
    </div>
  );
}

