"use client";

import React from "react";

export default function TruthLensRadarCore({ className = "" }: { className?: string }) {
  return (
    <div className={`radar-core pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="ring r1" />
      <div className="ring r2" />
      <div className="ring r3" />
      <div className="ring r4" />
      <div className="ring r5" />
      <div className="ring r6" />

      <div className="arc arc1" />
      <div className="arc arc2" />
      <div className="arc arc3" />

      <div className="core" />

      <span className="dot d1" />
      <span className="dot d2" />
      <span className="dot d3" />
      <span className="dot d4" />
      <span className="dot d5" />
      <span className="dot d6" />
      <span className="dot d7" />
      <span className="dot d8" />
    </div>
  );
}
