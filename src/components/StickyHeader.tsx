"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

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
        sticky top-0 z-40 text-center py-4 sm:py-6
        transition-all duration-300 ease-out
        ${isScrolled ? "backdrop-blur-md bg-white/90 shadow-sm" : "bg-white"}
      `}
    >
      {/* Container animates height when scrolled */}
      <div
        className={`
          relative flex flex-col items-center justify-center overflow-hidden
          transition-all duration-300 ease-out
          ${isScrolled ? "h-[40px] sm:h-[48px]" : "h-[80px] sm:h-[100px]"}
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
          <Image
            src="/logo.svg"
            alt={title}
            width={160}
            height={40}
            className="h-8 sm:h-10 w-auto"
            priority
          />
          <p className="text-neutral-600 text-base sm:text-lg mt-2">{author}</p>
          <a
            href={`https://instagram.com/${handle.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-sm px-2 py-1 -mx-2 -my-1 min-h-[44px] inline-flex items-center"
          >
            {handle}
          </a>
        </div>

        {/* Collapsed view */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center gap-2
            transition-all duration-300 ease-out
            ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          <Image
            src="/logo.svg"
            alt={title}
            width={100}
            height={25}
            className="h-5 sm:h-6 w-auto"
          />
          <span className="text-neutral-400">&middot;</span>
          <span className="text-neutral-600 text-sm sm:text-base">{author}</span>
        </div>
      </div>
    </header>
  );
}
