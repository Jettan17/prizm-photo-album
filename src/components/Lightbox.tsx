"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Photo } from "@/lib/photos";
import { ExifData, extractExif } from "@/lib/exif";

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ photos, currentIndex, onClose, onNavigate }: LightboxProps) {
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [loadingExif, setLoadingExif] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const photo = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const goToPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const goToNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  // Reset image loaded state when photo changes
  useEffect(() => {
    setIsImageLoaded(false);
  }, [currentIndex]);

  // Load EXIF data when photo changes
  useEffect(() => {
    setLoadingExif(true);
    setExifData(null);

    extractExif(photo.src).then((data) => {
      setExifData(data);
      setLoadingExif(false);
    });
  }, [photo.src]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "i":
          setShowInfo((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goToPrev, goToNext]);

  // Lock body scroll
  useEffect(() => {
    document.body.classList.add("lightbox-open");
    return () => document.body.classList.remove("lightbox-open");
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Info toggle button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo((prev) => !prev);
        }}
        className="absolute top-4 right-16 z-50 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Toggle photo info"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Previous button */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full hover:bg-black/40"
          aria-label="Previous photo"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full hover:bg-black/40"
          aria-label="Next photo"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main image container */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] min-h-[50vh] min-w-[50vw] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading spinner */}
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
          </div>
        )}

        {/* Image */}
        <Image
          src={photo.src}
          alt={photo.filename}
          width={1920}
          height={1080}
          className={`
            max-h-[90vh] w-auto object-contain rounded-lg
            transition-opacity duration-300
            ${isImageLoaded ? "opacity-100" : "opacity-0"}
          `}
          onLoad={() => setIsImageLoaded(true)}
          priority
        />

        {/* EXIF Panel - only show when image is loaded */}
        {showInfo && isImageLoaded && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm">
              {loadingExif ? (
                <span className="text-white/50">Loading info...</span>
              ) : exifData && Object.keys(exifData).length > 0 ? (
                <>
                  {exifData.dateTaken && (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {exifData.dateTaken}
                    </span>
                  )}
                  {exifData.camera && (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {exifData.camera}
                    </span>
                  )}
                  {exifData.focalLength && (
                    <span className="font-mono">{exifData.focalLength}</span>
                  )}
                  {exifData.aperture && (
                    <span className="font-mono">{exifData.aperture}</span>
                  )}
                  {exifData.shutterSpeed && (
                    <span className="font-mono">{exifData.shutterSpeed}</span>
                  )}
                  {exifData.iso && (
                    <span className="font-mono">ISO {exifData.iso}</span>
                  )}
                </>
              ) : (
                <span className="text-white/50">No camera info available</span>
              )}
            </div>
            {/* Photo counter */}
            <div className="text-center mt-3 text-white/50 text-xs">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
