"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n";
import type { HeroImage } from "@/lib/portfolio/types";

interface ImageCarouselProps {
  images: HeroImage[];
  title: string;
  locale: Locale;
  fallbackImage?: string;
}

export function ImageCarousel({
  images,
  title,
  locale,
  fallbackImage,
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  // Descriptive bilingual alt text, falling back to a generated label.
  const altFor = (img: HeroImage, index: number) => {
    const alt = locale === "es" ? img.alt_es : img.alt_en;
    return alt || `${title} screenshot ${index + 1} of ${images.length}`;
  };

  const validImages = images.filter((_, i) => !failedImages.has(i));

  if (images.length === 0 || validImages.length === 0) {
    if (fallbackImage) {
      return (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={fallbackImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>
      );
    }
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div
      className="relative"
      role="region"
      aria-label={`${title} image gallery`}
    >
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((img, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              <div className="relative aspect-video">
                {failedImages.has(index) ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    Image unavailable
                  </div>
                ) : (
                  <Image
                    src={img.src}
                    alt={altFor(img, index)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80"
            onClick={scrollPrev}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80"
            onClick={scrollNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
            role="tablist"
            aria-label="Image slides"
          >
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
