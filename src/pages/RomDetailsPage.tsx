import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRomPackage, useRomPackages, usePackageFiles } from '@/hooks/useRomPackages';
import { formatFileSize } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ExtensionBadge } from '@/components/ExtensionBadge';
import { PackageTypeBadge } from '@/components/PackageTypeBadge';
import { ArrowLeft, Copy, Download, Trash2, FolderInput, Star, Pencil, Check, X, Globe, Languages, ChevronRight, ChevronDown, File } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export default function RomDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: rom, isLoading } = useRomPackage(id);
  const { data: allPackages = [] } = useRomPackages();
  const { data: packageFiles = [] } = usePackageFiles(id);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFilename, setNewFilename] = useState('');
  const [treeExpanded, setTreeExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="pixel-border bg-card p-12 text-center">
        <p className="font-pixel text-[10px] text-muted-foreground animate-blink">LOADING...</p>
      </div>
    );
  }

  if (!rom) {
    return (
      <div className="pixel-border bg-card p-12 text-center">
        <p className="font-pixel text-[10px] text-destructive">ROM NOT FOUND</p>
        <button onClick={() => navigate('/library')} className="mt-4 font-retro text-sm text-primary hover:underline">← Back to Library</button>
      </div>
    );
  }

  const duplicates = rom.duplicate_group_id
    ? allPackages.filter(r => r.duplicate_group_id === rom.duplicate_group_id && r.id !== rom.id)
    : [];

  const copyHash = () => {
    if (rom.hash_sha256) {
      navigator.clipboard.writeText(rom.hash_sha256);
      toast.success('Hash copied to clipboard!');
    }
  };

  const startRename = () => {
    setNewFilename(rom.filename);
    setIsRenaming(true);
  };

  const confirmRename = async () => {
    if (newFilename.trim() && newFilename !== rom.filename) {
      const { error } = await supabase
        .from('rom_packages')
        .update({ filename: newFilename.trim() })
        .eq('id', rom.id);
      if (error) {
        toast.error('Rename failed: ' + error.message);
      } else {
        toast.success(`Renamed to "${newFilename}"`);
        queryClient.invalidateQueries({ queryKey: ['rom_package', id] });
        queryClient.invalidateQueries({ queryKey: ['rom_packages'] });
      }
    }
    setIsRenaming(false);
  };

  // Build file tree from JSON or package_files
  const fileTree = rom.file_tree as any;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-retro text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> BACK
      </button>

      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="font-pixel text-sm text-primary glow-green">{rom.title}</h1>
        <StatusBadge status={rom.status} />
        <PackageTypeBadge type={rom.package_type} totalFiles={rom.total_files} />
      </div>

      {/* Details Card */}
      <div className="pixel-border bg-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">FILENAME</label>
            {isRenaming ? (
              <div className="flex items-center gap-2 mt-1">
                <input type="text" value={newFilename} onChange={e => setNewFilename(e.target.value)}
                  className="flex-1 bg-background border border-primary px-2 py-1 font-mono text-sm text-foreground focus:outline-none" autoFocus
                  onKeyDown={e => e.key === 'Enter' && confirmRename()} />
                <button onClick={confirmRename} className="p-1 text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
                <button onClick={() => setIsRenaming(false)} className="p-1 text-destructive hover:text-destructive/80"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm text-foreground">{rom.filename}</p>
                <button onClick={startRename} className="p-1 text-muted-foreground hover:text-primary"><Pencil className="w-3 h-3" /></button>
              </div>
            )}
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">CONSOLE</label>
            <p className="font-retro text-sm text-retro-cyan">{rom.console || 'Unknown'}</p>
            {rom.detection_source && <p className="font-pixel text-[7px] text-muted-foreground">Detected from {rom.detection_source}</p>}
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">EXTENSION</label>
            {rom.file_extension ? <ExtensionBadge ext={rom.file_extension} /> : <p className="font-mono text-sm text-muted-foreground">N/A</p>}
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">TOTAL SIZE</label>
            <p className="font-mono text-sm text-foreground">{formatFileSize(Number(rom.file_size))}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">TOTAL FILES</label>
            <p className="font-mono text-sm text-foreground">{rom.total_files}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">UPLOAD DATE</label>
            <p className="font-mono text-sm text-foreground">{new Date(rom.upload_date).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">STORAGE PATH</label>
            <p className="font-mono text-sm text-retro-amber">{rom.storage_path}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">PACKAGE TYPE</label>
            <p className="font-retro text-sm text-foreground">{rom.package_type === 'folder' ? 'Folder Package' : 'Single File'}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> REGION</label>
            <p className="font-retro text-sm text-retro-cyan">{rom.region || 'Unknown'}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground flex items-center gap-1"><Languages className="w-3 h-3" /> LANGUAGE</label>
            <p className="font-retro text-sm text-retro-cyan">{rom.language || 'Unknown'}</p>
          </div>
        </div>

        {/* Hash */}
        <div>
          <label className="font-pixel text-[8px] text-muted-foreground">SHA256 HASH</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="font-mono text-xs text-foreground bg-background border border-border px-3 py-1.5 flex-1 overflow-x-auto">
              {rom.hash_sha256 || 'Not computed'}
            </code>
            {rom.hash_sha256 && (
              <button onClick={copyHash} className="p-1.5 border border-border hover:border-primary hover:text-primary text-muted-foreground">
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Package Contents (for folder packages) */}
      {(rom.package_type === 'folder' || packageFiles.length > 0) && (
        <div className="pixel-border bg-card p-4">
          <button onClick={() => setTreeExpanded(!treeExpanded)} className="flex items-center gap-2 mb-3">
            {treeExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <h2 className="font-pixel text-[10px] text-primary">PACKAGE CONTENTS</h2>
            <span className="font-pixel text-[7px] text-muted-foreground">{packageFiles.length} files</span>
          </button>
          {treeExpanded && (
            <div className="space-y-1">
              {packageFiles.map(f => (
                <div key={f.id} className="flex items-center gap-2 py-1 px-2 hover:bg-muted/20">
                  <File className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono text-sm text-foreground flex-1">{f.file_path}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{formatFileSize(Number(f.file_size))}</span>
                  {f.file_extension && <ExtensionBadge ext={f.file_extension} />}
                </div>
              ))}
              {packageFiles.length === 0 && fileTree && (
                <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">{JSON.stringify(fileTree, null, 2)}</pre>
              )}
            </div>
          )}
        </div>
      )}

      {/* Duplicate Group */}
      {rom.duplicate_group_id && (
        <div className="pixel-border-red bg-card p-6">
          <h2 className="font-pixel text-[10px] text-destructive mb-1 glow-red">⚠ DUPLICATE GROUP</h2>
          <p className="font-retro text-sm text-muted-foreground mb-4">This package is part of a duplicate group ({rom.duplicate_group_id})</p>
          <div className="space-y-2">
            {duplicates.map(dup => (
              <div key={dup.id} onClick={() => navigate(`/rom/${dup.id}`)}
                className="flex items-center justify-between p-3 border border-destructive/30 bg-destructive/5 cursor-pointer hover:bg-destructive/10">
                <div>
                  <p className="font-mono text-sm text-foreground">{dup.filename}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatFileSize(Number(dup.file_size))} · {new Date(dup.upload_date).toLocaleDateString()}
                    {dup.region && <span> · {dup.region}</span>}
                    {dup.language && <span> · {dup.language}</span>}
                  </p>
                </div>
                <StatusBadge status={dup.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pixel-border bg-card p-4">
        <h2 className="font-pixel text-[8px] text-muted-foreground mb-3">ACTIONS</h2>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary font-retro text-sm hover:bg-primary/10">
            <Download className="w-4 h-4" /> Download
          </button>
          <button onClick={startRename} className="flex items-center gap-2 px-4 py-2 border border-retro-cyan text-retro-cyan font-retro text-sm hover:bg-retro-cyan/10">
            <Pencil className="w-4 h-4" /> Rename
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-retro-amber text-retro-amber font-retro text-sm hover:bg-retro-amber/10">
            <FolderInput className="w-4 h-4" /> Move to Folder
          </button>
          {rom.duplicate_group_id && (
            <button className="flex items-center gap-2 px-4 py-2 border border-retro-cyan text-retro-cyan font-retro text-sm hover:bg-retro-cyan/10">
              <Star className="w-4 h-4" /> Mark as Primary
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive font-retro text-sm hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
