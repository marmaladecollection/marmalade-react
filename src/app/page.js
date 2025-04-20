"use client";

import { useEffect, useState } from "react";
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
        <Gallery items={items} />
      </main>
    </div>
  );
}

