import { File, FolderOpen } from 'lucide-react';

interface PackageTypeBadgeProps {
  type: 'file' | 'folder';
  totalFiles?: number;
  className?: string;
}

export function PackageTypeBadge({ type, totalFiles, className = '' }: PackageTypeBadgeProps) {
  if (type === 'folder') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-pixel text-[7px] border bg-retro-magenta/20 border-retro-magenta text-retro-magenta ${className}`}>
        <FolderOpen className="w-3 h-3" />
        FOLDER PACKAGE
        {totalFiles && totalFiles > 1 && <span>({totalFiles})</span>}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-pixel text-[7px] border bg-retro-blue/20 border-retro-blue text-retro-blue ${className}`}>
      <File className="w-3 h-3" />
      FILE ROM
    </span>
  );
}
