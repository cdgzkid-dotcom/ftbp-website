"use client";

import { ReactNode } from "react";
import { ThemeContext, useThemeState } from "@/hooks/useTheme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, mounted } = useThemeState();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
