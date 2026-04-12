export type RomStatus = 'uploading' | 'hashing' | 'processing' | 'sorted' | 'duplicate' | 'unsorted';

export interface RomFile {
  id: string;
  title: string;
  filename: string;
  console: string;
  file_extension: string;
  file_size: number;
  upload_date: string;
  hash: string;
  status: RomStatus;
  storage_path: string;
  duplicate_group_id?: string;
  suggested_console?: string;
  region?: string;
  language?: string;
}

export interface ConsoleInfo {
  name: string;
  manufacturer: string;
  extensions: string[];
  romCount: number;
  icon: string;
}

export const CONSOLES: ConsoleInfo[] = [
  { name: 'Game Boy', manufacturer: 'Nintendo', extensions: ['.gb'], romCount: 42, icon: '🎮' },
  { name: 'Game Boy Color', manufacturer: 'Nintendo', extensions: ['.gbc'], romCount: 38, icon: '🎮' },
  { name: 'Game Boy Advance', manufacturer: 'Nintendo', extensions: ['.gba'], romCount: 67, icon: '🎮' },
  { name: 'NES', manufacturer: 'Nintendo', extensions: ['.nes'], romCount: 156, icon: '🕹️' },
  { name: 'SNES', manufacturer: 'Nintendo', extensions: ['.sfc', '.smc'], romCount: 89, icon: '🕹️' },
  { name: 'Nintendo 64', manufacturer: 'Nintendo', extensions: ['.n64', '.z64'], romCount: 34, icon: '🎮' },
  { name: 'Nintendo DS', manufacturer: 'Nintendo', extensions: ['.nds'], romCount: 23, icon: '📱' },
  { name: 'GameCube', manufacturer: 'Nintendo', extensions: ['.iso', '.gcm'], romCount: 15, icon: '💿' },
  { name: 'Wii', manufacturer: 'Nintendo', extensions: ['.wbfs', '.iso'], romCount: 12, icon: '📀' },
  { name: 'PlayStation', manufacturer: 'Sony', extensions: ['.bin', '.cue', '.iso'], romCount: 78, icon: '💿' },
  { name: 'PlayStation 2', manufacturer: 'Sony', extensions: ['.iso', '.bin'], romCount: 45, icon: '💿' },
  { name: 'PSP', manufacturer: 'Sony', extensions: ['.iso', '.cso'], romCount: 29, icon: '📱' },
  { name: 'Genesis', manufacturer: 'Sega', extensions: ['.md', '.bin', '.gen'], romCount: 95, icon: '🕹️' },
  { name: 'Saturn', manufacturer: 'Sega', extensions: ['.bin', '.cue', '.iso'], romCount: 18, icon: '💿' },
  { name: 'Dreamcast', manufacturer: 'Sega', extensions: ['.cdi', '.gdi'], romCount: 22, icon: '💿' },
  { name: 'Master System', manufacturer: 'Sega', extensions: ['.sms'], romCount: 31, icon: '🕹️' },
  { name: 'Xbox', manufacturer: 'Microsoft', extensions: ['.iso'], romCount: 8, icon: '💿' },
  { name: 'MAME', manufacturer: 'Arcade', extensions: ['.zip'], romCount: 203, icon: '🕹️' },
  { name: 'Neo Geo', manufacturer: 'Arcade', extensions: ['.zip'], romCount: 47, icon: '🕹️' },
  { name: 'DOS', manufacturer: 'PC / Legacy', extensions: ['.exe', '.com', '.zip'], romCount: 56, icon: '💾' },
  { name: 'Amiga', manufacturer: 'PC / Legacy', extensions: ['.adf', '.hdf'], romCount: 33, icon: '💾' },
];

const MOCK_HASHES = [
  'a3f2b8c9d1e4f6a7b0c3d5e8f1a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6',
  'b7e9d3c1a5f8b2d6e0c4a8f2b6d0e4c8a2f6b0d4e8c2a6f0b4d8e2c6a0f4b8',
  'c1d5e9a3f7b2c6d0e4a8f2c6b0d4e8a2f6c0b4d8e2a6f0c4b8d2e6a0f4c8b2',
  'd4e8a2f6b0c4d8e2a6f0b4c8d2e6a0f4b8c2d6e0a4f8b2c6d0e4a8f2b6d0e4',
  'e8a2f6b0c4d8e2a6f0b4c8d2e6a0f4b8c2d6e0a4f8b2c6d0e4a8f2b6d0e4c8',
];

export const MOCK_ROMS: RomFile[] = [
  { id: '1', title: 'Super Mario Bros.', filename: 'Super_Mario_Bros.nes', console: 'NES', file_extension: '.nes', file_size: 40976, upload_date: '2024-03-15', hash: MOCK_HASHES[0], status: 'sorted', storage_path: '/roms/NES/Super_Mario_Bros.nes', region: 'USA', language: 'English' },
  { id: '2', title: 'The Legend of Zelda', filename: 'Legend_of_Zelda.nes', console: 'NES', file_extension: '.nes', file_size: 131088, upload_date: '2024-03-15', hash: MOCK_HASHES[1], status: 'sorted', storage_path: '/roms/NES/Legend_of_Zelda.nes', region: 'USA', language: 'English' },
  { id: '3', title: 'Sonic the Hedgehog', filename: 'Sonic_the_Hedgehog.md', console: 'Genesis', file_extension: '.md', file_size: 524288, upload_date: '2024-03-14', hash: MOCK_HASHES[2], status: 'sorted', storage_path: '/roms/Genesis/Sonic_the_Hedgehog.md', region: 'Europe', language: 'English' },
  { id: '4', title: 'Super Mario World', filename: 'Super_Mario_World.sfc', console: 'SNES', file_extension: '.sfc', file_size: 524288, upload_date: '2024-03-14', hash: MOCK_HASHES[3], status: 'sorted', storage_path: '/roms/SNES/Super_Mario_World.sfc', region: 'Japan', language: 'Japanese' },
  { id: '5', title: 'Pokémon Red', filename: 'Pokemon_Red.gb', console: 'Game Boy', file_extension: '.gb', file_size: 1048576, upload_date: '2024-03-13', hash: MOCK_HASHES[4], status: 'sorted', storage_path: '/roms/GB/Pokemon_Red.gb', region: 'USA', language: 'English' },
  { id: '6', title: 'Super Mario Bros. (Copy)', filename: 'Super_Mario_Bros_v2.nes', console: 'NES', file_extension: '.nes', file_size: 40976, upload_date: '2024-03-16', hash: MOCK_HASHES[0], status: 'duplicate', storage_path: '/duplicates/Super_Mario_Bros_v2.nes', duplicate_group_id: 'dup-1', region: 'USA', language: 'English' },
  { id: '7', title: 'Super Mario Bros.', filename: 'SMB1.nes', console: 'NES', file_extension: '.nes', file_size: 40976, upload_date: '2024-03-17', hash: MOCK_HASHES[0], status: 'duplicate', storage_path: '/duplicates/SMB1.nes', duplicate_group_id: 'dup-1', region: 'Europe', language: 'German' },
  { id: '8', title: 'Super Mario Bros. (Original)', filename: 'Super_Mario_Bros.nes', console: 'NES', file_extension: '.nes', file_size: 40976, upload_date: '2024-03-15', hash: MOCK_HASHES[0], status: 'duplicate', storage_path: '/roms/NES/Super_Mario_Bros.nes', duplicate_group_id: 'dup-1', region: 'Japan', language: 'Japanese' },
  { id: '9', title: 'Sonic (Copy)', filename: 'Sonic1.md', console: 'Genesis', file_extension: '.md', file_size: 524290, upload_date: '2024-03-18', hash: MOCK_HASHES[2], status: 'duplicate', storage_path: '/duplicates/Sonic1.md', duplicate_group_id: 'dup-2', region: 'USA', language: 'English' },
  { id: '10', title: 'Sonic the Hedgehog', filename: 'Sonic_the_Hedgehog.md', console: 'Genesis', file_extension: '.md', file_size: 524288, upload_date: '2024-03-14', hash: MOCK_HASHES[2], status: 'duplicate', storage_path: '/roms/Genesis/Sonic_the_Hedgehog.md', duplicate_group_id: 'dup-2', region: 'Europe', language: 'English' },
  { id: '11', title: 'unknown_game_1', filename: 'unknown_game_1.bin', console: '', file_extension: '.bin', file_size: 262144, upload_date: '2024-03-18', hash: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1', status: 'unsorted', storage_path: '/unsorted/unknown_game_1.bin', suggested_console: 'Genesis' },
  { id: '12', title: 'game_backup', filename: 'game_backup.iso', console: '', file_extension: '.iso', file_size: 734003200, upload_date: '2024-03-19', hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', status: 'unsorted', storage_path: '/unsorted/game_backup.iso' },
  { id: '13', title: 'retro_rom', filename: 'retro_rom.zip', console: '', file_extension: '.zip', file_size: 4194304, upload_date: '2024-03-19', hash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', status: 'unsorted', storage_path: '/unsorted/retro_rom.zip', suggested_console: 'MAME' },
  { id: '14', title: 'Metroid', filename: 'Metroid.nes', console: 'NES', file_extension: '.nes', file_size: 131088, upload_date: '2024-03-12', hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', status: 'sorted', storage_path: '/roms/NES/Metroid.nes', region: 'USA', language: 'English' },
  { id: '15', title: 'Final Fantasy VI', filename: 'Final_Fantasy_VI.sfc', console: 'SNES', file_extension: '.sfc', file_size: 3145728, upload_date: '2024-03-11', hash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', status: 'sorted', storage_path: '/roms/SNES/Final_Fantasy_VI.sfc', region: 'Japan', language: 'Japanese' },
  { id: '16', title: 'Street Fighter II', filename: 'sf2.zip', console: 'MAME', file_extension: '.zip', file_size: 6291456, upload_date: '2024-03-10', hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', status: 'sorted', storage_path: '/roms/MAME/sf2.zip', region: 'World', language: 'English' },
  { id: '17', title: 'Castlevania', filename: 'Castlevania.nes', console: 'NES', file_extension: '.nes', file_size: 131088, upload_date: '2024-03-09', hash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', status: 'sorted', storage_path: '/roms/NES/Castlevania.nes', region: 'USA', language: 'English' },
  { id: '18', title: 'Pokémon Blue', filename: 'Pokemon_Blue.gb', console: 'Game Boy', file_extension: '.gb', file_size: 1048576, upload_date: '2024-03-08', hash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', status: 'sorted', storage_path: '/roms/GB/Pokemon_Blue.gb', region: 'Europe', language: 'German' },
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
