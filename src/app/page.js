"use client";

import { useEffect, useState } from "react";
import { fetchAllItems } from "./firebase";

import Item from "./item";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
  }, []);

  return (
    <div>
      <main>
        <div className="gallery">
          {items.map((item) => (
              <Item key={item.name} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}

