"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

const ThemeDemo = () => {
  const { theme } = useTheme();

  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h3 className="text-lg font-bold mb-2">Theme Demo</h3>
      <p className="text-muted-foreground">
        Current theme: <span className="font-mono bg-secondary px-2 py-1 rounded">{theme}</span>
      </p>
      <div className="mt-4 flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-primary"></div>
        <span className="text-sm">Primary Color</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-secondary"></div>
        <span className="text-sm">Secondary Color</span>
      </div>
    </div>
  );
};

export default ThemeDemo;