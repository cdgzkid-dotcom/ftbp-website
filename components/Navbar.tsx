"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import Logo from "./Logo";

const NAV_LINKS = ["Episodios", "Sobre"];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 h-14 flex items-center px-8 border-b border-border"
      style={{
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background:
          theme === "dark"
            ? "rgba(22,23,25,0.92)"
            : "rgba(255,255,255,0.92)",
      }}
    >
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex flex-1 justify-center gap-8">
        {NAV_LINKS.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">
            {link}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div className="flex-shrink-0 flex items-center gap-3 ml-auto md:ml-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          role="switch"
          aria-checked={theme === "dark"}
          aria-label="Cambiar tema"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-text-sec hover:text-gold transition-colors text-lg"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* CTA */}
        <a href="#episodios" className="btn-primary hidden md:inline-block">
          Escuchar ahora
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`block w-5 h-0.5 bg-text-pri transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text-pri transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text-pri transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute top-14 left-0 right-0 border-b border-border p-6 flex flex-col gap-4 md:hidden"
          style={{
            backdropFilter: "blur(14px)",
            background:
              theme === "dark"
                ? "rgba(22,23,25,0.97)"
                : "rgba(255,255,255,0.97)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="nav-link text-base"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <a href="#episodios" className="btn-primary text-center mt-2">
            Escuchar ahora
          </a>
        </div>
      )}
    </nav>
  );
}
