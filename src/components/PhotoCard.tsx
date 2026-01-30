"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface PhotoCardProps {
  src: string;
  alt: string;
  index: number;
  onClick?: () => void;
}

export function PhotoCard({ src, alt, index, onClick }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start visible to prevent flash
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewport) {
      // Already in viewport - show immediately with subtle animation
      setIsVisible(true);
      setShouldAnimate(true);
    } else {
      // Below the fold - set up intersection observer
      setIsVisible(false);
      setShouldAnimate(true);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        }
      );

      observer.observe(element);

      return () => observer.disconnect();
    }
  }, []);

  // Stagger delay based on index (cycles through 0-3)
  const staggerClass = `stagger-${(index % 4) + 1}`;

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        ${shouldAnimate ? `scroll-reveal ${staggerClass}` : ""}
        ${isVisible ? "visible" : ""}
        relative overflow-hidden rounded-lg cursor-pointer
        transition-all duration-300 ease-out
        hover:shadow-xl hover:scale-[1.02]
        active:scale-[0.98] active:shadow-lg
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none
        ${isLoaded ? "" : "bg-neutral-100"}
      `}
      style={!shouldAnimate ? { opacity: 1, transform: "none" } : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className={`
          w-full h-auto object-cover
          transition-opacity duration-500
          ${isLoaded ? "opacity-100" : "opacity-0"}
        `}
        onLoad={() => setIsLoaded(true)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />
    </div>
  );
}
