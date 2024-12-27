"use client";

export default function Thumbnail({ item }) {
  return (
    <img src={`https://lh3.googleusercontent.com/d/${item.googleDriveId}`} />
  );
}

