"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

const getAutoTheme = (): Theme => {
  const h = new Date().getHours();
  return h >= 6 && h < 20 ? "light" : "dark";
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeState() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const manual = localStorage.getItem("ftbp-theme-manual");
    if (manual === "true") {
      const stored = localStorage.getItem("ftbp-theme") as Theme | null;
      setTheme(stored || getAutoTheme());
    } else {
      // Clear any stale auto-saved value
      localStorage.removeItem("ftbp-theme");
      setTheme(getAutoTheme());
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("ftbp-theme", next);
      localStorage.setItem("ftbp-theme-manual", "true");
      return next;
    });
  }, []);

  return { theme, toggleTheme, mounted };
}
