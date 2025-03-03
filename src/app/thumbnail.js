"use client";

export default function UnderThumbnail({ item }) {
  return (
    <img src={`/images/${item.name}.jpg`} />
  );
}

