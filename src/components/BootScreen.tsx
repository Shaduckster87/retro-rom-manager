import { useState, useEffect } from 'react';

const BOOT_LINES = [
  'ROM VAULT v2.4.1',
  '(C) 2024 RETRO SYSTEMS INC.',
  '',
  'Initializing hash engine............ OK',
  'Loading ROM database................ OK',
  'Checking storage paths.............. OK',
  'Mounting /roms/..................... OK',
  'Mounting /unsorted/................. OK',
  'Mounting /duplicates/............... OK',
  'SHA256 duplicate detection.......... ENABLED',
  '',
  'SYSTEM READY.',
];

export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 120);
      return () => clearTimeout(timer);
    } else {
      // Auto-redirect after boot sequence completes
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, onComplete]);

  // Allow skipping by clicking
  const handleSkip = () => {
    if (visibleLines >= BOOT_LINES.length) {
      onComplete();
    } else {
      setVisibleLines(BOOT_LINES.length);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-background flex items-center justify-center cursor-pointer"
      onClick={handleSkip}
    >
      <div className="max-w-2xl w-full px-8">
        <pre className="font-retro text-primary text-lg leading-relaxed glow-green">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i}>
              {line}
              {i === visibleLines - 1 && visibleLines < BOOT_LINES.length && (
                <span className="animate-blink">█</span>
              )}
            </div>
          ))}
          {visibleLines >= BOOT_LINES.length && (
            <div className="mt-2 animate-blink">{'>'} LOADING INTERFACE...█</div>
          )}
        </pre>
      </div>
    </div>
  );
}
