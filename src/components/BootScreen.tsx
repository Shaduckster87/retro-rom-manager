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
  '',
  '> PRESS ANY KEY TO CONTINUE_',
];

export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 120);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  useEffect(() => {
    const handler = () => {
      if (visibleLines >= BOOT_LINES.length) {
        setDismissed(true);
        setTimeout(onComplete, 300);
      } else {
        setVisibleLines(BOOT_LINES.length);
      }
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [visibleLines, onComplete]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-background flex items-center justify-center transition-opacity duration-300 ${dismissed ? 'opacity-0' : 'opacity-100'}`}>
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
        </pre>
      </div>
    </div>
  );
}
