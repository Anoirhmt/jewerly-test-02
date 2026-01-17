"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";

interface ScrollytellingCanvasProps {
  frameCount: number;
  framePrefix: string;
  frameExtension: string;
  className?: string;
  frame: number;
}

export default function ScrollytellingCanvas({
  frameCount,
  framePrefix,
  frameExtension,
  className = "",
  frame,
}: ScrollytellingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawImage = useCallback((index: number, imgList: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    if (!canvas || !imgList[index]) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const img = imgList[index];

    // Clear with background color
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Cover fit logic for "expanded" look
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image - scale by width
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image - scale by height
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const preloadImages = async () => {
      const promises = Array.from({ length: frameCount }, (_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/frames/${framePrefix}${i}.${frameExtension}`;
          img.onload = () => {
            loadedCount++;
            loadedImages[i] = img;
            setLoadProgress(Math.round((loadedCount / frameCount) * 100));
            if (loadedCount === frameCount) {
              setImages(loadedImages);
              setIsLoading(false);
              requestAnimationFrame(() => drawImage(0, loadedImages));
            }
            resolve(img);
          };
          img.onerror = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
              setImages(loadedImages);
              setIsLoading(false);
            }
            resolve(null);
          };
        });
      });
      await Promise.all(promises);
    };

    preloadImages();
  }, [frameCount, framePrefix, frameExtension, drawImage]);

  // Handle frame change
  useEffect(() => {
    if (images.length > 0) {
      drawImage(frame, images);
    }
  }, [frame, images, drawImage]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      if (images.length > 0) {
        drawImage(frame, images);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [images, drawImage, frame]);

  // Scroll logic
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0 || isLoading) return;
    
    // We only care about the scroll within the parent container (Hero)
    // But since the canvas is fixed/sticky, we can map the progress
    // Hero is 400vh, so progress 0 to 0.25 is roughly the hero section if it's at the top
    // However, the Hero component has its own useScroll. 
    // Let's make this component pure and accept progress as a prop if needed, 
    // or let it handle its own scroll mapping.
  });

  // To make it truly Awwwards-level, we'll let the Hero component control the frame
  // and pass it down, or we use a more global scroll listener.
  // For now, let's export a way to update the frame.
  
  // Actually, let's use useScroll with the parent container passed as a ref or detected.
  // But to keep it simple and high-performance, we'll listen to the scroll of the window
  // and map it to frames based on the component's position.

  return (
    <div className={`fixed inset-0 z-0 h-screen w-full bg-[#050505] ${className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white"
          >
            <div className="relative h-24 w-24">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="283"
                  animate={{ strokeDashoffset: 283 - (283 * loadProgress) / 100 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-widest uppercase font-light">
                {loadProgress}%
              </div>
            </div>
            <p className="mt-8 text-[10px] tracking-[0.5em] uppercase text-white/40">
              Initialisation du luxe
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

// Custom hook for frame calculation to be used in Hero
export function useScrollytelling(frameCount: number, scrollProgress: any) {
  const [frame, setFrame] = useState(0);

  useMotionValueEvent(scrollProgress, "change", (latest: number) => {
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(latest * frameCount)
    );
    setFrame(frameIndex);
  });

  return frame;
}
