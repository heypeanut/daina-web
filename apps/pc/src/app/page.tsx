"use client";

import React from "react";

export default function HomePage() {
  return (
    <div
      className="homepage"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>代拿网 - PC端</h1>
      <p style={{ fontSize: "1.2rem" }}>这是PC端首页，运行在端口3005</p>
    </div>
  );
}
