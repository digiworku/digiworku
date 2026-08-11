import React from 'react';

export function ChatDoodleBackground({ darkMode }: { darkMode: boolean }) {
  // SVG stroke color dynamically matches the light/dark mode for high fidelity.
  // In light mode, we use a very soft, subtle grey/charcoal.
  // In dark mode, we use a very soft, faint white/teal.
  const strokeColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 49, 31, 0.045)';
  const textColor = darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 49, 31, 0.035)';

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="chat-doodle-pattern"
            width="320"
            height="320"
            patternUnits="userSpaceOnUse"
          >
            {/* --- GROUP 1: TOP LEFT (0 to 160, 0 to 160) --- */}
            {/* Graphics Design (Palette / Paint brush) */}
            <g transform="translate(20, 15)">
              <path
                d="M 12,25 C 5,25 2,20 2,12 C 2,4 12,2 22,2 C 28,2 32,6 32,12 C 32,18 28,22 22,22"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="10" cy="10" r="1.5" fill={strokeColor} />
              <circle cx="18" cy="8" r="1.5" fill={strokeColor} />
              <circle cx="24" cy="12" r="1.5" fill={strokeColor} />
              {/* Brush */}
              <path
                d="M 5,28 L 22,11 L 25,14 L 8,31 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
              />
              <path d="M 5,28 L 2,33 L 7,31 Z" fill={strokeColor} />
              <text
                x="-10"
                y="45"
                fontFamily="var(--font-display)"
                fontSize="7.5"
                fontWeight="800"
                letterSpacing="0.5"
                fill={textColor}
              >
                GRAPHICS
              </text>
              <text
                x="-4"
                y="53"
                fontFamily="var(--font-display)"
                fontSize="7.5"
                fontWeight="800"
                letterSpacing="0.5"
                fill={textColor}
              >
                DESIGN
              </text>
            </g>

            {/* Laptop & WEB DEV */}
            <g transform="translate(110, 20)">
              {/* Screen */}
              <rect
                x="5"
                y="5"
                width="34"
                height="22"
                rx="2"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
              />
              {/* Keyboard base */}
              <path
                d="M 1,27 L 43,27 L 41,31 L 3,31 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Trackpad line */}
              <line x1="19" y1="29" x2="25" y2="29" stroke={strokeColor} strokeWidth="1" />
              {/* Code tags on screen */}
              <path
                d="M 14,12 L 10,16 L 14,20 M 30,12 L 34,16 L 30,20"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
              />
              <text
                x="4"
                y="44"
                fontFamily="var(--font-mono)"
                fontSize="8"
                fontWeight="bold"
                fill={textColor}
              >
                &lt;WEB DEV/&gt;
              </text>
            </g>

            {/* --- GROUP 2: TOP RIGHT (160 to 320, 0 to 160) --- */}
            {/* Clapperboard / Scene 1 / Video */}
            <g transform="translate(210, 15)">
              <rect
                x="5"
                y="8"
                width="36"
                height="24"
                rx="2"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
              />
              {/* Top bar of clapper */}
              <line x1="5" y1="14" x2="41" y2="14" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="12" y1="8" x2="16" y2="14" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="22" y1="8" x2="26" y2="14" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="32" y1="8" x2="36" y2="14" stroke={strokeColor} strokeWidth="1.2" />
              <text
                x="9"
                y="24"
                fontFamily="var(--font-display)"
                fontSize="6"
                fontWeight="bold"
                fill={textColor}
              >
                SCENE 1
              </text>
              <text
                x="11"
                y="42"
                fontFamily="var(--font-display)"
                fontSize="7.5"
                fontWeight="900"
                letterSpacing="0.5"
                fill={textColor}
              >
                DEV-OPS
              </text>
            </g>

            {/* Server / Cloud Database */}
            <g transform="translate(240, 75)">
              <rect
                x="2"
                y="2"
                width="28"
                height="32"
                rx="3"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
              />
              {/* Server slots */}
              <line x1="6" y1="10" x2="26" y2="10" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="6" y1="18" x2="26" y2="18" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="6" y1="26" x2="26" y2="26" stroke={strokeColor} strokeWidth="1.2" />
              {/* Lights */}
              <circle cx="23" cy="10" r="1" fill={strokeColor} />
              <circle cx="23" cy="18" r="1" fill={strokeColor} />
              <circle cx="23" cy="26" r="1" fill={strokeColor} />
            </g>

            {/* Coffee mug */}
            <g transform="translate(25, 95)">
              <path
                d="M 8,8 L 24,8 L 22,24 C 22,28 10,28 10,24 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M 24,12 C 27,12 28,14 28,16 C 28,18 27,20 24,20"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
              />
              {/* Steam */}
              <path d="M 12,4 Q 14,1 12,0 M 16,4 Q 18,1 16,0" fill="none" stroke={strokeColor} strokeWidth="1" />
            </g>

            {/* --- GROUP 3: BOTTOM LEFT (0 to 160, 160 to 320) --- */}
            {/* Game Controller */}
            <g transform="translate(20, 180)">
              <path
                d="M 10,14 C 4,14 2,18 2,24 C 2,34 10,36 14,32 L 18,28 L 26,28 L 30,32 C 34,36 42,34 42,24 C 42,18 40,14 34,14 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* D-Pad */}
              <path d="M 9,21 H 13 M 11,19 V 23" fill="none" stroke={strokeColor} strokeWidth="1.2" />
              {/* Buttons */}
              <circle cx="31" cy="20" r="1.5" fill={strokeColor} />
              <circle cx="35" cy="23" r="1.5" fill={strokeColor} />
              <text
                x="5"
                y="45"
                fontFamily="var(--font-display)"
                fontSize="8"
                fontWeight="900"
                letterSpacing="1"
                fill={textColor}
              >
                CHATS
              </text>
            </g>

            {/* Agency Partners / Compass */}
            <g transform="translate(90, 120)">
              <circle
                cx="20"
                cy="20"
                r="14"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
              />
              <path
                d="M 20,10 L 23,17 L 30,20 L 23,23 L 20,30 L 17,23 L 10,20 L 17,17 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <text
                x="-25"
                y="46"
                fontFamily="var(--font-display)"
                fontSize="8"
                fontWeight="800"
                letterSpacing="0.4"
                fill={textColor}
              >
                AGENCY PARTNERS
              </text>
            </g>

            {/* --- GROUP 4: BOTTOM RIGHT (160 to 320, 160 to 320) --- */}
            {/* Phone & App */}
            <g transform="translate(230, 175)">
              <rect
                x="5"
                y="2"
                width="24"
                height="40"
                rx="4"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
              />
              {/* Screen inner lines */}
              <line x1="5" y1="6" x2="29" y2="6" stroke={strokeColor} strokeWidth="1" />
              <line x1="5" y1="36" x2="29" y2="36" stroke={strokeColor} strokeWidth="1" />
              {/* Speaker & home button */}
              <line x1="14" y1="4" x2="20" y2="4" stroke={strokeColor} strokeWidth="0.8" />
              <circle cx="17" cy="39" r="1.5" fill="none" stroke={strokeColor} strokeWidth="1" />
              {/* Interactive app grid */}
              <rect x="9" y="10" width="4" height="4" rx="0.5" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <rect x="15" y="10" width="4" height="4" rx="0.5" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <rect x="21" y="10" width="4" height="4" rx="0.5" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <rect x="9" y="16" width="4" height="4" rx="0.5" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <rect x="15" y="16" width="4" height="4" rx="0.5" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <text
                x="7"
                y="52"
                fontFamily="var(--font-display)"
                fontSize="8.5"
                fontWeight="bold"
                fill={textColor}
              >
                App
              </text>
            </g>

            {/* Rocket & Launch */}
            <g transform="translate(145, 210)">
              <path
                d="M 12,25 Q 18,12 30,5 Q 23,22 10,32 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Fins */}
              <path d="M 11,29 L 5,32 L 8,26 Z M 21,19 L 26,16 L 23,12 Z" fill="none" stroke={strokeColor} strokeWidth="1" />
              {/* Fire flames */}
              <path d="M 7,33 Q 3,38 8,36 M 10,32 Q 5,42 12,38" fill="none" stroke={strokeColor} strokeWidth="1" />
              {/* Window */}
              <circle cx="18" cy="18" r="2.5" fill="none" stroke={strokeColor} strokeWidth="1" />
            </g>

            {/* TECH AGENCY text */}
            <g transform="translate(130, 140)">
              <text
                x="0"
                y="15"
                fontFamily="var(--font-display)"
                fontSize="9"
                fontWeight="800"
                letterSpacing="0.8"
                fill={textColor}
              >
                TECH AGENCY
              </text>
            </g>

            {/* General scattered shapes for organic doodle style (stars, sparkles, bubbles) */}
            <g transform="translate(10, 10)">
              {/* Star */}
              <path d="M 60,75 L 62,79 L 66,80 L 62,81 L 60,85 L 58,81 L 54,80 L 58,79 Z" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              {/* Small circles / bubbles */}
              <circle cx="10" cy="70" r="1.5" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <circle cx="140" cy="80" r="1" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <circle cx="190" cy="30" r="2" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <circle cx="280" cy="130" r="1.5" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              {/* Sparkle */}
              <path d="M 290,40 L 291,42 L 293,43 L 291,44 L 290,46 L 289,44 L 287,43 L 289,42 Z" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <path d="M 180,190 L 181,192 L 183,193 L 181,194 L 180,196 L 179,194 L 177,193 L 179,192 Z" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              <path d="M 110,270 L 111,272 L 113,273 L 111,274 L 110,276 L 109,274 L 107,273 L 109,272 Z" fill="none" stroke={strokeColor} strokeWidth="0.8" />
              {/* Plus markers */}
              <path d="M 75,200 V 204 M 73,202 H 77" stroke={strokeColor} strokeWidth="0.8" />
              <path d="M 285,270 V 274 M 283,272 H 287" stroke={strokeColor} strokeWidth="0.8" />
            </g>

          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chat-doodle-pattern)" />
      </svg>
    </div>
  );
}
