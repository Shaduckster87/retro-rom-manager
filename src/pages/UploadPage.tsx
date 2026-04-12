import { useState, useEffect, useCallback } from 'react';
import { Upload as UploadIcon, X } from 'lucide-react';
import { RomStatus } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ExtensionBadge } from '@/components/ExtensionBadge';

interface UploadQueueItem {
  id: string;
  filename: string;
  extension: string;
  size: number;
  status: RomStatus;
  progress: number;
  result?: 'duplicate' | 'sorted' | 'unsorted';
}

const SIMULATED_FILES = [
  { name: 'Mario_Kart_64.z64', size: 12582912 },
  { name: 'Zelda_OoT.n64', size: 33554432 },
  { name: 'Contra.nes', size: 131088 },
  { name: 'unknown_backup.bin', size: 524288 },
  { name: 'Sonic_the_Hedgehog.md', size: 524288 },
];

export default function UploadPage() {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const simulateUpload = useCallback((files: Array<{ name: string; size: number }>) => {
    const newItems: UploadQueueItem[] = files.map((f, i) => ({
      id: `upload-${Date.now()}-${i}`,
      filename: f.name,
      extension: '.' + f.name.split('.').pop(),
      size: f.size,
      status: 'uploading' as RomStatus,
      progress: 0,
    }));

    setQueue(prev => [...prev, ...newItems]);

    // Simulate progression for each item
    newItems.forEach((item, index) => {
      const delay = index * 500;

      // Uploading phase
      const uploadSteps = [20, 40, 60, 80, 100];
      uploadSteps.forEach((p, stepI) => {
        setTimeout(() => {
          setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: p } : q));
        }, delay + stepI * 200);
      });

      // Hashing phase
      setTimeout(() => {
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'hashing', progress: 0 } : q));
      }, delay + 1200);

      [30, 60, 100].forEach((p, stepI) => {
        setTimeout(() => {
          setQueue(prev => prev.map(q => q.id === item.id && q.status === 'hashing' ? { ...q, progress: p } : q));
        }, delay + 1200 + stepI * 300);
      });

      // Processing phase
      setTimeout(() => {
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing', progress: 50 } : q));
      }, delay + 2400);

      // Result
      setTimeout(() => {
        const isDuplicate = item.filename.includes('Sonic');
        const isUnknown = item.filename.includes('unknown');
        const result = isDuplicate ? 'duplicate' : isUnknown ? 'unsorted' : 'sorted';
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: result, progress: 100, result } : q));
      }, delay + 3200);
    });
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Simulate with predefined files
    simulateUpload(SIMULATED_FILES.slice(0, 3));
  };

  const handleAddDemo = () => {
    simulateUpload(SIMULATED_FILES);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-pixel text-sm text-primary glow-green">UPLOAD ROMS</h1>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleAddDemo}
        className={`pixel-border bg-card p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragOver ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'
        }`}
      >
        <UploadIcon className={`w-12 h-12 mb-4 ${dragOver ? 'text-primary animate-pixel-pulse' : 'text-muted-foreground'}`} />
        <p className="font-pixel text-[10px] text-foreground mb-2">DROP ROM FILES HERE</p>
        <p className="font-retro text-sm text-muted-foreground">or click to simulate upload demo</p>
        <p className="font-mono text-xs text-muted-foreground mt-2">.nes .sfc .gb .gba .n64 .md .iso .bin .zip +more</p>
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
                item.result === 'duplicate' ? 'pixel-border-red' :
                item.result === 'unsorted' ? 'pixel-border-amber' : 'border-border'
              } bg-background`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-retro text-sm text-foreground">{item.filename}</span>
                    <ExtensionBadge ext={item.extension} />
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Progress bar */}
                <div className="retro-progress">
                  <div
                    className={`retro-progress-fill ${
                      item.status === 'hashing' ? '!bg-retro-magenta' :
                      item.status === 'duplicate' ? '!bg-destructive' :
                      item.status === 'unsorted' ? '!bg-retro-amber' : ''
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-4 mt-2 font-retro text-xs">
                  <span className={item.status === 'uploading' ? 'text-retro-cyan' : 'text-muted-foreground'}>
                    {item.status === 'uploading' ? '▶' : '✓'} Upload
                  </span>
                  <span className={item.status === 'hashing' ? 'text-retro-magenta animate-blink' : item.progress === 100 && item.status !== 'uploading' ? 'text-muted-foreground' : 'text-muted/50'}>
                    {item.status === 'hashing' ? '▶ Hashing...' : '○ Hash'}
                  </span>
                  <span className={item.status === 'processing' ? 'text-retro-blue' : 'text-muted/50'}>
                    {item.status === 'processing' ? '▶ Checking...' : '○ Check'}
                  </span>
                  <span className={item.result ? (item.result === 'sorted' ? 'text-primary' : item.result === 'duplicate' ? 'text-destructive' : 'text-retro-amber') : 'text-muted/50'}>
                    {item.result === 'sorted' && '✓ Sorted'}
                    {item.result === 'duplicate' && '⚠ Duplicate detected'}
                    {item.result === 'unsorted' && '? Needs review'}
                    {!item.result && '○ Sort'}
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
