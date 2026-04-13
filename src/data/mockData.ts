// Static data only - no more mock ROMs
export type RomStatus = 'uploading' | 'hashing' | 'processing' | 'sorted' | 'duplicate' | 'unsorted';
export type PackageType = 'file' | 'folder';

export interface ConsoleInfo {
  name: string;
  manufacturer: string;
  extensions: string[];
  icon: string;
}

export const CONSOLES: ConsoleInfo[] = [
  { name: 'Game Boy', manufacturer: 'Nintendo', extensions: ['.gb'], icon: '🎮' },
  { name: 'Game Boy Color', manufacturer: 'Nintendo', extensions: ['.gbc'], icon: '🎮' },
  { name: 'Game Boy Advance', manufacturer: 'Nintendo', extensions: ['.gba'], icon: '🎮' },
  { name: 'NES', manufacturer: 'Nintendo', extensions: ['.nes'], icon: '🕹️' },
  { name: 'SNES', manufacturer: 'Nintendo', extensions: ['.sfc', '.smc'], icon: '🕹️' },
  { name: 'Nintendo 64', manufacturer: 'Nintendo', extensions: ['.n64', '.z64'], icon: '🎮' },
  { name: 'Nintendo DS', manufacturer: 'Nintendo', extensions: ['.nds'], icon: '📱' },
  { name: 'GameCube', manufacturer: 'Nintendo', extensions: ['.iso', '.gcm'], icon: '💿' },
  { name: 'Wii', manufacturer: 'Nintendo', extensions: ['.wbfs', '.iso'], icon: '📀' },
  { name: 'PlayStation', manufacturer: 'Sony', extensions: ['.bin', '.cue', '.iso'], icon: '💿' },
  { name: 'PlayStation 2', manufacturer: 'Sony', extensions: ['.iso', '.bin'], icon: '💿' },
  { name: 'PSP', manufacturer: 'Sony', extensions: ['.iso', '.cso'], icon: '📱' },
  { name: 'Genesis', manufacturer: 'Sega', extensions: ['.md', '.bin', '.gen'], icon: '🕹️' },
  { name: 'Saturn', manufacturer: 'Sega', extensions: ['.bin', '.cue', '.iso'], icon: '💿' },
  { name: 'Dreamcast', manufacturer: 'Sega', extensions: ['.cdi', '.gdi'], icon: '💿' },
  { name: 'Master System', manufacturer: 'Sega', extensions: ['.sms'], icon: '🕹️' },
  { name: 'Xbox', manufacturer: 'Microsoft', extensions: ['.iso'], icon: '💿' },
  { name: 'MAME', manufacturer: 'Arcade', extensions: ['.zip'], icon: '🕹️' },
  { name: 'Neo Geo', manufacturer: 'Arcade', extensions: ['.zip'], icon: '🕹️' },
  { name: 'DOS', manufacturer: 'PC / Legacy', extensions: ['.exe', '.com', '.zip'], icon: '💾' },
  { name: 'Amiga', manufacturer: 'PC / Legacy', extensions: ['.adf', '.hdf'], icon: '💾' },
];

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getStatusColor(status: RomStatus): string {
  switch (status) {
    case 'sorted': return 'text-primary';
    case 'duplicate': return 'text-destructive';
    case 'unsorted': return 'text-retro-amber';
    case 'uploading': return 'text-retro-cyan';
    case 'hashing': return 'text-retro-magenta';
    case 'processing': return 'text-retro-blue';
    default: return 'text-muted-foreground';
  }
}

export function getStatusBgColor(status: RomStatus): string {
  switch (status) {
    case 'sorted': return 'bg-primary/20 border-primary';
    case 'duplicate': return 'bg-destructive/20 border-destructive';
    case 'unsorted': return 'bg-retro-amber/20 border-retro-amber';
    case 'uploading': return 'bg-retro-cyan/20 border-retro-cyan';
    case 'hashing': return 'bg-retro-magenta/20 border-retro-magenta';
    case 'processing': return 'bg-retro-blue/20 border-retro-blue';
    default: return 'bg-muted border-border';
  }
}

export function getStatusLabel(status: RomStatus): string {
  switch (status) {
    case 'sorted': return 'OK';
    case 'duplicate': return 'DUPLICATE';
    case 'unsorted': return 'UNSORTED';
    case 'uploading': return 'UPLOADING';
    case 'hashing': return 'HASHING';
    case 'processing': return 'PROCESSING';
    default: return String(status).toUpperCase();
  }
}

// Detect console from file extensions
export function detectConsoleFromExtension(ext: string): string | null {
  const lower = ext.toLowerCase();
  for (const c of CONSOLES) {
    if (c.extensions.includes(lower)) return c.name;
  }
  return null;
}
