import { Monitor } from 'lucide-react';

// Simple store for CRT toggle - no zustand needed, use context-free approach
let listeners: Array<() => void> = [];
let crtEnabled = true;

export function getCrtEnabled() { return crtEnabled; }
export function setCrtEnabled(val: boolean) {
  crtEnabled = val;
  listeners.forEach(l => l());
}
export function subscribeCrt(listener: () => void) {
  listeners.push(listener);
  return () => { listeners = listeners.filter(l => l !== listener); };
}

import { useSyncExternalStore } from 'react';

export function useCrt() {
  return useSyncExternalStore(subscribeCrt, getCrtEnabled);
}

export function CRTToggle() {
  const enabled = useCrt();
  return (
    <button
      onClick={() => setCrtEnabled(!enabled)}
      className={`flex items-center gap-2 px-3 py-1.5 border text-sm font-retro transition-colors ${
        enabled ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground bg-muted'
      }`}
      title="Toggle CRT Effect"
    >
      <Monitor className="w-4 h-4" />
      CRT {enabled ? 'ON' : 'OFF'}
    </button>
  );
}
