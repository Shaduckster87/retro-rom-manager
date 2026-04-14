import { useState, useCallback, useRef } from 'react';
import { Upload as UploadIcon, X, FolderUp, File } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { ExtensionBadge } from '@/components/ExtensionBadge';
import { PackageTypeBadge } from '@/components/PackageTypeBadge';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { detectConsoleFromExtension } from '@/data/mockData';
import { toast } from 'sonner';
import { ShieldAlert } from 'lucide-react';

interface UploadQueueItem {
  id: string;
  file: globalThis.File;
  packageName: string;
  extension: string;
  size: number;
  status: 'uploading' | 'hashing' | 'processing' | 'sorted' | 'duplicate' | 'unsorted';
  progress: number;
  hash?: string;
}

async function computeSHA256(file: globalThis.File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function UploadPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="font-pixel text-sm text-primary glow-green">UPLOAD ROM PACKAGES</h1>
        <div className="pixel-border bg-card p-12 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-destructive mx-auto" />
          <p className="font-pixel text-[10px] text-destructive">ACCESS DENIED</p>
          <p className="font-retro text-sm text-muted-foreground">Only administrators can upload files.</p>
        </div>
      </div>
    );
  }

  const processFile = async (file: globalThis.File) => {
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const itemId = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const item: UploadQueueItem = {
      id: itemId,
      file,
      packageName: file.name,
      extension: ext,
      size: file.size,
      status: 'uploading',
      progress: 0,
    };

    setQueue(prev => [...prev, item]);

    try {
      // Step 1: Upload to storage
      const storagePath = `uploads/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('rom-files')
        .upload(storagePath, file, {
          onUploadProgress: (p) => {
            const pct = Math.round((p.loaded / p.total) * 100);
            setQueue(prev => prev.map(q => q.id === itemId ? { ...q, progress: pct } : q));
          }
        });

      if (uploadError) throw uploadError;

      // Step 2: Hashing
      setQueue(prev => prev.map(q => q.id === itemId ? { ...q, status: 'hashing', progress: 0 } : q));
      const hash = await computeSHA256(file);
      setQueue(prev => prev.map(q => q.id === itemId ? { ...q, progress: 100, hash } : q));

      // Step 3: Check duplicates
      setQueue(prev => prev.map(q => q.id === itemId ? { ...q, status: 'processing', progress: 50 } : q));
      const { data: existing } = await supabase
        .from('rom_packages')
        .select('id, duplicate_group_id')
        .eq('hash_sha256', hash);

      const isDuplicate = existing && existing.length > 0;
      const detectedConsole = detectConsoleFromExtension(ext);
      const isUnsorted = !detectedConsole;

      const finalStatus = isDuplicate ? 'duplicate' : isUnsorted ? 'unsorted' : 'sorted';
      const storageDest = isDuplicate ? '/duplicates/' : isUnsorted ? '/unsorted/' : `/roms/${detectedConsole}/`;
      
      let duplicateGroupId: string | null = null;
      if (isDuplicate && existing.length > 0) {
        duplicateGroupId = existing[0].duplicate_group_id || hash.slice(0, 8);
        // Update existing entry to have group id too
        if (!existing[0].duplicate_group_id) {
          await supabase.from('rom_packages').update({ duplicate_group_id: duplicateGroupId, status: 'duplicate' }).eq('id', existing[0].id);
        }
      }

      const title = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

      // Step 4: Insert into DB
      const { error: dbError } = await supabase.from('rom_packages').insert({
        title,
        filename: file.name,
        file_extension: ext,
        file_size: file.size,
        hash_sha256: hash,
        status: finalStatus,
        storage_path: storageDest + file.name,
        package_type: 'file',
        total_files: 1,
        console: detectedConsole,
        detection_source: detectedConsole ? 'file extension' : null,
        duplicate_group_id: duplicateGroupId,
      });

      if (dbError) throw dbError;

      setQueue(prev => prev.map(q => q.id === itemId ? { ...q, status: finalStatus, progress: 100 } : q));
      queryClient.invalidateQueries({ queryKey: ['rom_packages'] });

      if (isDuplicate) {
        toast.warning(`${file.name} — Duplicate detected!`);
      } else if (isUnsorted) {
        toast.info(`${file.name} — Needs review`);
      } else {
        toast.success(`${file.name} — Sorted to ${detectedConsole}`);
      }
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
      setQueue(prev => prev.filter(q => q.id !== itemId));
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(processFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-pixel text-sm text-primary glow-green">UPLOAD ROM PACKAGES</h1>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`pixel-border bg-card p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragOver ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'
        }`}
      >
        <div className="flex gap-4 mb-4">
          <UploadIcon className={`w-12 h-12 ${dragOver ? 'text-primary animate-pixel-pulse' : 'text-muted-foreground'}`} />
          <FolderUp className={`w-12 h-12 ${dragOver ? 'text-retro-magenta animate-pixel-pulse' : 'text-muted-foreground'}`} />
        </div>
        <p className="font-pixel text-[10px] text-foreground mb-2">DROP FILES HERE OR CLICK TO BROWSE</p>
        <p className="font-retro text-sm text-muted-foreground">Files will be hashed, checked for duplicates, and sorted automatically</p>
        <p className="font-mono text-xs text-muted-foreground mt-2">.nes .sfc .gb .gba .n64 .z64 .nds .iso .bin .zip +more</p>
      </div>

      {/* Upload Queue */}
      {queue.length > 0 && (
        <div className="pixel-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-[10px] text-primary">UPLOAD QUEUE</h2>
            <button onClick={() => setQueue([])} className="font-retro text-sm text-muted-foreground hover:text-destructive">
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.id} className={`p-3 border ${
                item.status === 'duplicate' ? 'pixel-border-red' :
                item.status === 'unsorted' ? 'pixel-border-amber' : 'border-border'
              } bg-background`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-muted-foreground" />
                    <span className="font-retro text-sm text-foreground">{item.packageName}</span>
                    <ExtensionBadge ext={item.extension} />
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="retro-progress">
                  <div className={`retro-progress-fill ${
                    item.status === 'hashing' ? '!bg-retro-magenta' :
                    item.status === 'duplicate' ? '!bg-destructive' :
                    item.status === 'unsorted' ? '!bg-retro-amber' : ''
                  }`} style={{ width: `${item.progress}%` }} />
                </div>

                <div className="flex items-center gap-4 mt-2 font-retro text-xs">
                  <span className={item.status === 'uploading' ? 'text-retro-cyan' : 'text-muted-foreground'}>
                    {item.status === 'uploading' ? '▶' : '✓'} Upload
                  </span>
                  <span className={item.status === 'hashing' ? 'text-retro-magenta animate-blink' : item.hash ? 'text-muted-foreground' : 'text-muted/50'}>
                    {item.status === 'hashing' ? '▶ Hashing...' : item.hash ? '✓ Hash' : '○ Hash'}
                  </span>
                  <span className={item.status === 'processing' ? 'text-retro-blue' : 'text-muted/50'}>
                    {item.status === 'processing' ? '▶ Checking...' : '○ Check'}
                  </span>
                  <span className={
                    item.status === 'sorted' ? 'text-primary' :
                    item.status === 'duplicate' ? 'text-destructive' :
                    item.status === 'unsorted' ? 'text-retro-amber' : 'text-muted/50'
                  }>
                    {item.status === 'sorted' && '✓ Sorted'}
                    {item.status === 'duplicate' && '⚠ Duplicate detected'}
                    {item.status === 'unsorted' && '? Needs review'}
                    {!['sorted','duplicate','unsorted'].includes(item.status) && '○ Sort'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
