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
  const containerRef = useRef<HTMLDivElement>(null);

  // Box size parameters
  // Reduced distance (gap) between the boxes for a tighter, high-tech fit
  const CELL_SIZE = 76;   // Tighter grid cell size
  const RECT_SIZE = 73;   // Tighter box size, making the distance (gap) only 3px
  const GAP_SIZE = 3;     // Narrow gap size
  const PADDING = 1.5;    // Balanced padding

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

  // Generate beautiful, staggered blinking background blocks
  useEffect(() => {
    const cols = Math.max(4, Math.ceil(dimensions.width / CELL_SIZE));
    const rows = Math.max(4, Math.ceil(dimensions.height / CELL_SIZE));

    // Increased count of blinking blocks (58) for a rich, dense automatic blinking experience
    const count = 58;
    const generatedBlocks: GridBlock[] = [];

    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      let w = 1;
      let h = 1;

      // Some double-size blocks for organic variation
      if (typeRand > 0.88) {
        w = 2;
      } else if (typeRand > 0.78) {
        h = 2;
      }

      generatedBlocks.push({
        id: `blink-block-${i}-${cols}-${rows}`,
        col: Math.floor(Math.random() * Math.max(1, cols - w)),
        row: Math.floor(Math.random() * Math.max(1, rows - h)),
        widthCells: w,
        heightCells: h,
        maxOpacity: 0.12 + Math.random() * 0.32, // Distinct yet soft premium blinking opacity
        duration: 1.8 + Math.random() * 2.8,     // Faster, highly active, lively blinking (1.8s to 4.6s cycle)
        delay: Math.random() * 4,                 // Naturally staggered trigger delays
      });
    }

    setBlocks(generatedBlocks);
  }, [dimensions, CELL_SIZE]);

  // Determine grid block background colors based on mode
  const blockBgClass = darkMode
    ? 'bg-white/[0.08] dark:bg-white/[0.12]'
    : 'bg-[#00311F]/[0.12]'; // Highly visible brand pine green block fill for light mode

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
              rx={12} // Smooth corner radius for squircle-like premium look
              ry={12}
              fill="none"
              stroke={darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 49, 31, 0.085)'}
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#digiworku-tight-grid)" />
      </svg>

      {/* Automatically Animated Blinking Blocks Overlay */}
      <div className="absolute inset-0 w-full h-full">
        {blocks.map((block) => {
          const left = block.col * CELL_SIZE + PADDING;
          const top = block.row * CELL_SIZE + PADDING;
          const width = block.widthCells * CELL_SIZE - GAP_SIZE;
          const height = block.heightCells * CELL_SIZE - GAP_SIZE;

          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: [0, block.maxOpacity, block.maxOpacity * 0.25, block.maxOpacity, 0],
                scale: [0.98, 1, 0.99, 1, 0.98]
              }}
              transition={{
                duration: block.duration,
                delay: block.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`absolute rounded-[11px] ${blockBgClass} backdrop-blur-[0.5px]`}
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
    </div>
  );
}
