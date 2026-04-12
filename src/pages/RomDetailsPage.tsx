import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_ROMS, formatFileSize } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ExtensionBadge } from '@/components/ExtensionBadge';
import { ArrowLeft, Copy, Download, Trash2, FolderInput, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function RomDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rom = MOCK_ROMS.find(r => r.id === id);

  if (!rom) {
    return (
      <div className="pixel-border bg-card p-12 text-center">
        <p className="font-pixel text-[10px] text-destructive">ROM NOT FOUND</p>
        <button onClick={() => navigate('/library')} className="mt-4 font-retro text-sm text-primary hover:underline">← Back to Library</button>
      </div>
    );
  }

  const duplicates = rom.duplicate_group_id
    ? MOCK_ROMS.filter(r => r.duplicate_group_id === rom.duplicate_group_id && r.id !== rom.id)
    : [];

  const copyHash = () => {
    navigator.clipboard.writeText(rom.hash);
    toast.success('Hash copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-retro text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> BACK
      </button>

      <div className="flex items-center gap-4">
        <h1 className="font-pixel text-sm text-primary glow-green">{rom.title}</h1>
        <StatusBadge status={rom.status} />
      </div>

      {/* Details Card */}
      <div className="pixel-border bg-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">FILENAME</label>
            <p className="font-mono text-sm text-foreground">{rom.filename}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">CONSOLE</label>
            <p className="font-retro text-sm text-retro-cyan">{rom.console || 'Unknown'}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">EXTENSION</label>
            <ExtensionBadge ext={rom.file_extension} />
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">FILE SIZE</label>
            <p className="font-mono text-sm text-foreground">{formatFileSize(rom.file_size)}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">UPLOAD DATE</label>
            <p className="font-mono text-sm text-foreground">{rom.upload_date}</p>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">STORAGE PATH</label>
            <p className="font-mono text-sm text-retro-amber">{rom.storage_path}</p>
          </div>
        </div>

        {/* Hash */}
        <div>
          <label className="font-pixel text-[8px] text-muted-foreground">SHA256 HASH</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="font-mono text-xs text-foreground bg-background border border-border px-3 py-1.5 flex-1 overflow-x-auto">
              {rom.hash}
            </code>
            <button onClick={copyHash} className="p-1.5 border border-border hover:border-primary hover:text-primary text-muted-foreground">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Duplicate Group */}
      {rom.duplicate_group_id && (
        <div className="pixel-border-red bg-card p-6">
          <h2 className="font-pixel text-[10px] text-destructive mb-1 glow-red">⚠ DUPLICATE GROUP</h2>
          <p className="font-retro text-sm text-muted-foreground mb-4">This file is part of a duplicate group ({rom.duplicate_group_id})</p>

          <div className="space-y-2">
            {duplicates.map(dup => (
              <div
                key={dup.id}
                onClick={() => navigate(`/rom/${dup.id}`)}
                className="flex items-center justify-between p-3 border border-destructive/30 bg-destructive/5 cursor-pointer hover:bg-destructive/10"
              >
                <div>
                  <p className="font-mono text-sm text-foreground">{dup.filename}</p>
                  <p className="font-mono text-xs text-muted-foreground">{formatFileSize(dup.file_size)} · {dup.upload_date}</p>
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
