"use client";

import { useEffect, useState } from "react";
import { fetchAllItems } from "./firebase";
import Gallery from "./gallery";

export default function Home() {
  // Temporary mock data to test if items display (server-side compatible)
  const mockItems = [
    { id: 'camel-sofa', name: 'Camel Sofa', price: 1000 },
    { id: 'card-table', name: 'Card Table', price: 800 },
    { id: 'desk-manor', name: 'Desk Manor', price: 1200 }
  ];

  const [items, setItems] = useState(mockItems);

  useEffect(() => {
    // fetchAllItems(setItems);
  }, []);

  return (
    <div>
      <main>
        <Gallery items={items} />
      </main>
    </div>
  );
}

