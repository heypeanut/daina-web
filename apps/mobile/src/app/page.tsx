"use client";

import React from "react";

export default function MobileHomePage() {
  return (
    <div
      className="mobile-homepage"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        代拿网 - 移动端
      </h1>
      <p style={{ fontSize: "1.2rem" }}>这是移动端首页，运行在端口3006</p>
      <p style={{ fontSize: "1rem", marginTop: "2rem", color: "#666" }}>
        移动端将采用无限滚动加载设计
      </p>
    </div>
  );
}
