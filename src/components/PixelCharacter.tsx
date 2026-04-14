import { useState, useEffect } from 'react';

interface PixelCharacterProps {
  type: 'hero' | 'ghost' | 'coin' | 'mushroom' | 'star';
  size?: number;
  className?: string;
  animated?: boolean;
}

const CHARACTERS: Record<string, string[]> = {
  hero: [
    '  ████  ',
    ' ██████ ',
    ' █▓█▓██ ',
    ' ██████ ',
    '  ████  ',
    ' ██████ ',
    '██ ██ ██',
    '   ██   ',
    '  ████  ',
    ' ██  ██ ',
  ],
  ghost: [
    '  ████  ',
    ' ██████ ',
    '██▓▓██▓▓',
    '████████',
    '████████',
    '████████',
    '██ ██ ██',
  ],
  coin: [
    ' ████ ',
    '██  ██',
    '█ ██ █',
    '█ ██ █',
    '██  ██',
    ' ████ ',
  ],
  mushroom: [
    '  ████  ',
    ' █▓▓▓▓█ ',
    '██▓▓▓▓██',
    '████████',
    ' ██  ██ ',
    ' ██  ██ ',
  ],
  star: [
    '   ██   ',
    '  ████  ',
    '████████',
    ' ██████ ',
    '  ████  ',
    ' ██  ██ ',
  ],
};

const TYPE_COLORS: Record<string, string> = {
  hero: 'text-retro-cyan',
  ghost: 'text-retro-magenta',
  coin: 'text-retro-amber',
  mushroom: 'text-destructive',
  star: 'text-retro-amber',
};

export function PixelCharacter({ type, size = 24, className = '', animated = true }: PixelCharacterProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const timer = setInterval(() => setFrame(f => (f + 1) % 2), 500);
    return () => clearInterval(timer);
  }, [animated]);

  const color = TYPE_COLORS[type] || 'text-primary';
  const bounce = animated && frame === 1 ? 'translate-y-[-2px]' : '';

  return (
    <div
      className={`inline-block ${color} ${className} transition-transform duration-200`}
      style={{ width: size, height: size, transform: bounce ? 'translateY(-2px)' : undefined }}
    >
      <svg viewBox="0 0 8 10" width={size} height={size} style={{ imageRendering: 'pixelated' }}>
        {type === 'hero' && (
          <>
            <rect x="2" y="0" width="4" height="1" fill="hsl(var(--retro-cyan))" />
            <rect x="1" y="1" width="6" height="1" fill="hsl(var(--retro-cyan))" />
            <rect x="1" y="2" width="2" height="1" fill="hsl(var(--primary))" />
            <rect x="3" y="2" width="1" height="1" fill="hsl(var(--foreground))" />
            <rect x="4" y="2" width="2" height="1" fill="hsl(var(--primary))" />
            <rect x="6" y="2" width="1" height="1" fill="hsl(var(--foreground))" />
            <rect x="1" y="3" width="6" height="1" fill="hsl(var(--retro-cyan))" />
            <rect x="2" y="4" width="4" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="1" y="5" width="6" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="0" y="6" width="2" height="1" fill="hsl(var(--retro-cyan))" />
            <rect x="3" y="6" width="2" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="6" y="6" width="2" height="1" fill="hsl(var(--retro-cyan))" />
            <rect x="2" y="7" width="4" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="1" y="8" width="2" height="1" fill="hsl(var(--destructive))" />
            <rect x="5" y="8" width="2" height="1" fill="hsl(var(--destructive))" />
          </>
        )}
        {type === 'ghost' && (
          <>
            <rect x="2" y="0" width="4" height="1" fill="hsl(var(--retro-magenta))" />
            <rect x="1" y="1" width="6" height="1" fill="hsl(var(--retro-magenta))" />
            <rect x="0" y="2" width="2" height="1" fill="hsl(var(--retro-magenta))" />
            <rect x="2" y="2" width="1" height="1" fill="hsl(var(--foreground))" />
            <rect x="3" y="2" width="2" height="1" fill="hsl(var(--retro-magenta))" />
            <rect x="5" y="2" width="1" height="1" fill="hsl(var(--foreground))" />
            <rect x="6" y="2" width="2" height="1" fill="hsl(var(--retro-magenta))" />
            <rect x="0" y="3" width="8" height="3" fill="hsl(var(--retro-magenta))" />
            <rect x="0" y="6" width="2" height="1" fill="hsl(var(--retro-magenta))" />
            <rect x="3" y="6" width="2" height="1" fill="hsl(var(--retro-magenta))" />
            <rect x="6" y="6" width="2" height="1" fill="hsl(var(--retro-magenta))" />
          </>
        )}
        {type === 'coin' && (
          <>
            <rect x="1" y="0" width="4" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="0" y="1" width="6" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="0" y="2" width="1" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="2" y="2" width="2" height="1" fill="hsl(var(--retro-yellow))" />
            <rect x="5" y="2" width="1" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="0" y="3" width="1" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="2" y="3" width="2" height="1" fill="hsl(var(--retro-yellow))" />
            <rect x="5" y="3" width="1" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="0" y="4" width="6" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="1" y="5" width="4" height="1" fill="hsl(var(--retro-amber))" />
          </>
        )}
        {type === 'mushroom' && (
          <>
            <rect x="2" y="0" width="4" height="1" fill="hsl(var(--destructive))" />
            <rect x="1" y="1" width="6" height="1" fill="hsl(var(--destructive))" />
            <rect x="1" y="1" width="2" height="1" fill="hsl(var(--foreground))" />
            <rect x="5" y="1" width="2" height="1" fill="hsl(var(--foreground))" />
            <rect x="0" y="2" width="8" height="1" fill="hsl(var(--destructive))" />
            <rect x="0" y="3" width="8" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="1" y="4" width="2" height="2" fill="hsl(var(--retro-amber))" />
            <rect x="5" y="4" width="2" height="2" fill="hsl(var(--retro-amber))" />
          </>
        )}
        {type === 'star' && (
          <>
            <rect x="3" y="0" width="2" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="2" y="1" width="4" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="0" y="2" width="8" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="1" y="3" width="6" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="2" y="4" width="4" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="1" y="5" width="2" height="1" fill="hsl(var(--retro-amber))" />
            <rect x="5" y="5" width="2" height="1" fill="hsl(var(--retro-amber))" />
          </>
        )}
      </svg>
    </div>
  );
}

// Floating pixel art decorations
export function FloatingPixels() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <div className="absolute top-[10%] right-[5%] animate-float-slow opacity-10">
        <PixelCharacter type="star" size={16} animated={false} />
      </div>
      <div className="absolute bottom-[15%] left-[3%] animate-float-medium opacity-10">
        <PixelCharacter type="coin" size={12} animated={false} />
      </div>
      <div className="absolute top-[60%] right-[8%] animate-float-fast opacity-8">
        <PixelCharacter type="ghost" size={14} animated={false} />
      </div>
    </div>
  );
}
