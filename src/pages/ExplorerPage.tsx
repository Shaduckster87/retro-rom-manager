import { useState } from 'react';
import { useRomPackages } from '@/hooks/useRomPackages';
import { formatFileSize } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { PackageTypeBadge } from '@/components/PackageTypeBadge';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { RomPackage } from '@/hooks/useRomPackages';

interface FolderNode {
  name: string;
  path: string;
  children: FolderNode[];
  files: RomPackage[];
}

function buildTree(packages: RomPackage[]): FolderNode {
  const root: FolderNode = { name: '/', path: '/', children: [], files: [] };

  const folders: Record<string, FolderNode> = { '/': root };

  ['/roms/', '/unsorted/', '/duplicates/'].forEach(path => {
    folders[path] = { name: path.replace(/\//g, '').replace(/^/, '/'), path, children: [], files: [] };
    root.children.push(folders[path]);
  });

  // Create console sub-folders from data
  const consoleFolders = new Set(
    packages.filter(r => r.storage_path.startsWith('/roms/')).map(r => {
      const parts = r.storage_path.split('/');
      return parts.length > 3 ? `/roms/${parts[2]}/` : '/roms/';
    })
  );
  consoleFolders.forEach(path => {
    if (path === '/roms/') return;
    const name = path.split('/').filter(Boolean).pop() || '';
    const node: FolderNode = { name, path, children: [], files: [] };
    folders[path] = node;
    folders['/roms/'].children.push(node);
  });

  // Assign files
  packages.forEach(rom => {
    const dirParts = rom.storage_path.split('/');
    dirParts.pop();
    let dirPath = dirParts.join('/') + '/';

    if (folders[dirPath]) {
      folders[dirPath].files.push(rom);
    } else if (rom.storage_path.startsWith('/roms/')) {
      folders['/roms/'].files.push(rom);
    } else if (rom.storage_path.startsWith('/unsorted/')) {
      folders['/unsorted/'].files.push(rom);
    } else if (rom.storage_path.startsWith('/duplicates/')) {
      folders['/duplicates/'].files.push(rom);
    }
  });

  return root;
}

function FolderView({ node, depth = 0 }: { node: FolderNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasContent = node.children.length > 0 || node.files.length > 0;

  return (
    <div>
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-muted/30"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasContent ? (
          expanded ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : <span className="w-3" />}
        {expanded ? <FolderOpen className="w-4 h-4 text-retro-amber" /> : <Folder className="w-4 h-4 text-retro-amber" />}
        <span className="font-mono text-sm text-foreground">{node.name}</span>
        <span className="font-pixel text-[7px] text-muted-foreground ml-auto">{node.files.length} packages</span>
      </div>

      {expanded && (
        <>
          {node.children.map(child => (
            <FolderView key={child.path} node={child} depth={depth + 1} />
          ))}
          {node.files.map(file => (
            <div key={file.id} className="flex items-center gap-2 py-1 px-2 hover:bg-muted/20 group"
              style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}>
              <File className="w-3 h-3 text-muted-foreground" />
              <span className="font-mono text-sm text-foreground flex-1">{file.filename}</span>
              <PackageTypeBadge type={file.package_type} totalFiles={file.total_files} className="text-[6px]" />
              <span className="font-mono text-[10px] text-muted-foreground">{formatFileSize(Number(file.file_size))}</span>
              <StatusBadge status={file.status} className="text-[7px]" />
              <button onClick={(e) => { e.stopPropagation(); toast.info(`Move ${file.filename}`); }}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-primary">
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function ExplorerPage() {
  const { data: packages = [], isLoading } = useRomPackages();
  const tree = buildTree(packages);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-pixel text-sm text-primary glow-green">🗂 EXPLORER</h1>
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground animate-blink">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-pixel text-sm text-primary glow-green">🗂 EXPLORER</h1>
      <div className="pixel-border bg-card p-2">
        <div className="border-b border-border pb-2 mb-2 px-2">
          <span className="font-pixel text-[8px] text-muted-foreground">FILE SYSTEM</span>
        </div>
        {tree.children.map(child => (
          <FolderView key={child.path} node={child} />
        ))}
      </div>
    </div>
  );
}
