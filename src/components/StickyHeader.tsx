"use client";

import { useEffect, useState, useRef } from "react";

interface StickyHeaderProps {
  title: string;
  author: string;
  handle: string;
}

export function StickyHeader({ title, author, handle }: StickyHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY.current;

      // Hysteresis: different thresholds for scroll up vs down
      if (isScrollingDown && currentY > 100) {
        setIsScrolled(true);
      } else if (!isScrollingDown && currentY < 50) {
        setIsScrolled(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-40 text-center py-6
        transition-all duration-300 ease-out
        ${isScrolled ? "backdrop-blur-md bg-white/90 shadow-sm" : "bg-white"}
      `}
    >
      {/* Container animates height when scrolled */}
      <div
        className={`
          relative flex flex-col items-center justify-center overflow-hidden
          transition-all duration-300 ease-out
          ${isScrolled ? "h-[48px]" : "h-[100px]"}
        `}
      >
        {/* Expanded view */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center
            transition-all duration-300 ease-out
            ${isScrolled ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}
          `}
        >
          <h1 className="font-display text-5xl font-bold">{title}</h1>
          <p className="text-neutral-600 text-lg mt-1">{author}</p>
          <a
            href={`https://instagram.com/${handle.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-800 transition-colors text-sm"
          >
            {handle}
          </a>
        </div>

        {/* Collapsed view */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-300 ease-out
            ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          <span className="font-display text-xl font-bold">{title}</span>
          <span className="text-neutral-400 mx-2">&middot;</span>
          <span className="text-neutral-600">{author}</span>
        </div>
      </div>
    </header>
  );
}
