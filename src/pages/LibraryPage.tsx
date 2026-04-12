import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ROMS, formatFileSize, RomStatus } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ExtensionBadge } from '@/components/ExtensionBadge';
import { Search } from 'lucide-react';

export default function LibraryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterConsole, setFilterConsole] = useState('all');
  const [filterExt, setFilterExt] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const consoles = [...new Set(MOCK_ROMS.map(r => r.console).filter(Boolean))];
  const extensions = [...new Set(MOCK_ROMS.map(r => r.file_extension))];

  const filtered = MOCK_ROMS.filter(rom => {
    if (search && !rom.title.toLowerCase().includes(search.toLowerCase()) && !rom.filename.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterConsole !== 'all' && rom.console !== filterConsole) return false;
    if (filterExt !== 'all' && rom.file_extension !== filterExt) return false;
    if (filterStatus !== 'all' && rom.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-pixel text-sm text-primary glow-green">ROM LIBRARY</h1>

      {/* Filters */}
      <div className="pixel-border bg-card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ROMs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-background border border-border px-8 py-1.5 font-retro text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <select value={filterConsole} onChange={e => setFilterConsole(e.target.value)} className="bg-background border border-border px-3 py-1.5 font-retro text-sm text-foreground">
            <option value="all">All Consoles</option>
            {consoles.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterExt} onChange={e => setFilterExt(e.target.value)} className="bg-background border border-border px-3 py-1.5 font-retro text-sm text-foreground">
            <option value="all">All Extensions</option>
            {extensions.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-background border border-border px-3 py-1.5 font-retro text-sm text-foreground">
            <option value="all">All Status</option>
            <option value="sorted">Sorted</option>
            <option value="duplicate">Duplicate</option>
            <option value="unsorted">Unsorted</option>
          </select>
        </div>
      </div>

      {/* ROM Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(rom => (
          <div
            key={rom.id}
            onClick={() => navigate(`/rom/${rom.id}`)}
            className="pixel-border bg-card p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-retro text-lg text-foreground leading-tight">{rom.title}</h3>
              <StatusBadge status={rom.status} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              {rom.console && <span className="font-pixel text-[8px] text-retro-cyan">{rom.console}</span>}
              <ExtensionBadge ext={rom.file_extension} />
            </div>
            {(rom.region || rom.language) && (
              <div className="flex items-center gap-2 mb-2 text-xs font-mono text-muted-foreground">
                {rom.region && <span className="text-retro-amber">{rom.region}</span>}
                {rom.language && <span className="text-retro-magenta">{rom.language}</span>}
              </div>
            )}
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>{formatFileSize(rom.file_size)}</span>
              <span>{rom.upload_date}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground">NO ROMS FOUND</p>
        </div>
      )}
    </div>
  );
}
