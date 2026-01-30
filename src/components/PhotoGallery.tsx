"use client";

import { useState, useEffect } from "react";
import { Photo } from "@/lib/photos";
import { PhotoCard } from "./PhotoCard";
import { Lightbox } from "./Lightbox";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [shuffledPhotos, setShuffledPhotos] = useState(photos);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setShuffledPhotos(shuffleArray(photos));
  }, [photos]);

  if (shuffledPhotos.length === 0) {
    return (
      <div className="text-center text-neutral-500 py-8 sm:py-12 px-4">
        <p>No photos found.</p>
        <p className="mt-2 text-sm sm:text-base">
          Add images to{" "}
          <code className="bg-neutral-100 px-2 py-1 rounded text-xs sm:text-sm break-all">/public/photos/</code>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 sm:gap-4">
        {shuffledPhotos.map((photo, index) => (
          <div key={photo.filename} className="break-inside-avoid mb-2 sm:mb-4">
            <PhotoCard
              src={photo.src}
              alt={photo.filename}
              index={index}
              onClick={() => setLightboxIndex(index)}
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={shuffledPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
