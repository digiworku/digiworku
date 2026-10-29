import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

interface GridBlock {
  id: string;
  col: number;
  row: number;
  widthCells: number;
  heightCells: number;
  maxOpacity: number;
  duration: number;
  delay: number;
}

export function AnimatedGridBackground({ darkMode }: { darkMode: boolean }) {
  const [blocks, setBlocks] = useState<GridBlock[]>([]);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Box size parameters
  const CELL_SIZE = 76;
  const RECT_SIZE = 73;
  const GAP_SIZE = 3;
  const PADDING = 1.5;

  // Reduced motion preference check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver to pause when offscreen
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Listen to container resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Generate optimized blinking background blocks (mobile: 8, desktop: 18)
  useEffect(() => {
    if (prefersReducedMotion) {
      setBlocks([]);
      return;
    }

    const cols = Math.max(4, Math.ceil(dimensions.width / CELL_SIZE));
    const rows = Math.max(4, Math.ceil(dimensions.height / CELL_SIZE));

    // Dynamic density: Mobile gets 8 blocks, desktop gets 18 (drastically down from 58)
    const isMobile = dimensions.width < 768;
    const count = isMobile ? 8 : 18;
    const generatedBlocks: GridBlock[] = [];

    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      let w = 1;
      let h = 1;

      if (!isMobile && typeRand > 0.85) {
        w = 2;
      } else if (!isMobile && typeRand > 0.75) {
        h = 2;
      }

      generatedBlocks.push({
        id: `blink-block-${i}-${cols}-${rows}`,
        col: Math.floor(Math.random() * Math.max(1, cols - w)),
        row: Math.floor(Math.random() * Math.max(1, rows - h)),
        widthCells: w,
        heightCells: h,
        maxOpacity: 0.12 + Math.random() * 0.22,
        duration: 2.4 + Math.random() * 2.6,
        delay: Math.random() * 3,
      });
    }

    setBlocks(generatedBlocks);
  }, [dimensions, CELL_SIZE, prefersReducedMotion]);

  const blockBgClass = darkMode
    ? 'bg-white/[0.08] dark:bg-white/[0.12]'
    : 'bg-[#00311F]/[0.10]';

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Main geometric rounded squircle grid layout */}
      <svg width="100%" height="100%" className="absolute inset-0 opacity-100">
        <defs>
          <pattern
            id="digiworku-tight-grid"
            width={CELL_SIZE}
            height={CELL_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <rect
              x={PADDING}
              y={PADDING}
              width={RECT_SIZE}
              height={RECT_SIZE}
              rx={12}
              ry={12}
              fill="none"
              stroke={darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 49, 31, 0.085)'}
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#digiworku-tight-grid)" />
      </svg>

      {/* Automatically Animated Blinking Blocks Overlay — only renders when visible and allowed */}
      {isVisible && !prefersReducedMotion && (
        <div className="absolute inset-0 w-full h-full">
          {blocks.map((block) => {
            const left = block.col * CELL_SIZE + PADDING;
            const top = block.row * CELL_SIZE + PADDING;
            const width = block.widthCells * CELL_SIZE - GAP_SIZE;
            const height = block.heightCells * CELL_SIZE - GAP_SIZE;

            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: [0, block.maxOpacity, block.maxOpacity * 0.3, block.maxOpacity, 0],
                  scale: [0.98, 1, 0.99, 1, 0.98]
                }}
                transition={{
                  duration: block.duration,
                  delay: block.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`absolute rounded-[11px] ${blockBgClass} backdrop-blur-[0.5px] will-change-transform`}
                style={{
                  left,
                  top,
                  width,
                  height,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
export default AnimatedGridBackground;
