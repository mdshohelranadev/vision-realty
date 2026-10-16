"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function Lightbox({
  images,
  index,
  alt,
  onClose,
  onChange,
}: {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onChange]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} image gallery`}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/95 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" aria-hidden />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index - 1 + images.length) % images.length);
        }}
        aria-label="Previous image"
        className="absolute left-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden />
      </button>
      <div
        className="relative h-[78vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`${alt} image ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index + 1) % images.length);
        }}
        aria-label="Next image"
        className="absolute right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
      >
        <ChevronRight className="h-6 w-6" aria-hidden />
      </button>
      <p className="absolute bottom-5 text-sm text-slate-300">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
