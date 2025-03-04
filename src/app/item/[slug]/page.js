"use client";

import { useEffect, useState } from "react";
import { fetchItemById } from "../../firebase";
import ItemPrimary from "./itemprimary";
import ItemSecondary from "./itemsecondary";

export default function ItemPage() {
  const [item, setItem] = useState([]);

  useEffect(() => {
    const pathname = window.location.pathname;
    const itemIdFromPath = pathname.split("/").pop();
    fetchItemById(itemIdFromPath, setItem);
  }, []);

  return (
    <div>
      <ItemPrimary item={item} />
      <ItemSecondary item={item} />
    </div>
  );
}
