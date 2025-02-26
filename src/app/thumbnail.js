"use client";

export default function UnderThumbnail({ item }) {
  return (
    <img src={`https://lh3.googleusercontent.com/d/${item.googleDriveId}`} />
  );
}

