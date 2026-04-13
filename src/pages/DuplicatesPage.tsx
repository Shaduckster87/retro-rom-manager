import { useRomPackages } from '@/hooks/useRomPackages';
import { formatFileSize } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ExtensionBadge } from '@/components/ExtensionBadge';
import { PackageTypeBadge } from '@/components/PackageTypeBadge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function DuplicatesPage() {
  const navigate = useNavigate();
  const { data: packages = [], isLoading } = useRomPackages();

  const duplicates = packages.filter(r => r.duplicate_group_id);

  const groups: Record<string, typeof duplicates> = {};
  duplicates.forEach(rom => {
    if (rom.duplicate_group_id) {
      if (!groups[rom.duplicate_group_id]) groups[rom.duplicate_group_id] = [];
      groups[rom.duplicate_group_id].push(rom);
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-pixel text-sm text-destructive glow-red">♻ DUPLICATES</h1>
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground animate-blink">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="font-pixel text-sm text-destructive glow-red">♻ DUPLICATES</h1>
        <span className="font-pixel text-[8px] text-muted-foreground">{Object.keys(groups).length} GROUPS</span>
      </div>

      {Object.entries(groups).map(([groupId, roms]) => (
        <div key={groupId} className="pixel-border-red bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠</span>
              <div>
                <h2 className="font-pixel text-[10px] text-destructive">GROUP: {groupId.toUpperCase()}</h2>
                <p className="font-retro text-xs text-muted-foreground">{roms.length} packages · Full package hash match</p>
              </div>
            </div>
            {roms[0].hash_sha256 && (
              <span className="font-mono text-[10px] text-muted-foreground break-all max-w-[200px]">{roms[0].hash_sha256.slice(0, 24)}...</span>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {roms.map((rom, i) => {
              const sizesDiffer = roms.some(r => r.file_size !== rom.file_size);
              return (
                <div key={rom.id} onClick={() => navigate(`/rom/${rom.id}`)}
                  className="flex items-center justify-between p-3 border border-destructive/20 bg-background cursor-pointer hover:bg-destructive/5">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked={i === 0} className="accent-primary" onClick={e => e.stopPropagation()} />
                    <div>
                      <span className="font-mono text-sm text-foreground">{rom.filename}</span>
                      {rom.filename !== roms[0].filename && (
                        <span className="ml-2 font-pixel text-[7px] text-retro-amber">NAME DIFFERS</span>
                      )}
                      {sizesDiffer && rom.file_size !== roms[0].file_size && (
                        <span className="ml-2 font-pixel text-[7px] text-retro-amber">SIZE DIFFERS</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PackageTypeBadge type={rom.package_type} totalFiles={rom.total_files} />
                    <span className="font-mono text-xs text-muted-foreground">{formatFileSize(Number(rom.file_size))}</span>
                    <span className="font-mono text-xs text-muted-foreground">{new Date(rom.upload_date).toLocaleDateString()}</span>
                    {rom.file_extension && <ExtensionBadge ext={rom.file_extension} />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-destructive/20">
            <button onClick={() => toast.success('Selected packages kept, others deleted')}
              className="px-3 py-1.5 border border-primary text-primary font-retro text-sm hover:bg-primary/10">
              Keep Selected, Delete Others
            </button>
            <button onClick={() => toast.success('All moved to /roms/')}
              className="px-3 py-1.5 border border-retro-amber text-retro-amber font-retro text-sm hover:bg-retro-amber/10">
              Move All to /roms/
            </button>
            <button onClick={() => toast.info('Duplicate flag ignored')}
              className="px-3 py-1.5 border border-muted-foreground text-muted-foreground font-retro text-sm hover:bg-muted/30">
              Keep All (Ignore)
            </button>
          </div>
        </div>
      ))}

      {Object.keys(groups).length === 0 && (
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-primary">✓ NO DUPLICATES FOUND</p>
        </div>
      )}
    </div>
  );
}
