"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("../components/MapClient"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#faf8f5",
      fontFamily: "sans-serif",
      color: "#888",
      fontSize: "14px",
    }}>
      Ladowanie mapy...
    </div>
  ),
});

export default function Home() {
  return <MapClient />;
}
