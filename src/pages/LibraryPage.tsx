import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRomPackages } from '@/hooks/useRomPackages';
import { formatFileSize, RomStatus } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ExtensionBadge } from '@/components/ExtensionBadge';
import { PackageTypeBadge } from '@/components/PackageTypeBadge';
import { Search, X } from 'lucide-react';

export default function LibraryPage() {
  const navigate = useNavigate();
  const { data: packages = [], isLoading } = useRomPackages();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterConsole, setFilterConsole] = useState('all');
  const [filterExt, setFilterExt] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timer);
  }, [search]);

  const consoles = useMemo(() => [...new Set(packages.map(r => r.console).filter(Boolean))], [packages]);
  const extensions = useMemo(() => [...new Set(packages.map(r => r.file_extension).filter(Boolean))], [packages]);

  const filtered = useMemo(() => packages.filter(rom => {
    const q = debouncedSearch.toLowerCase();
    if (q) {
      const matchTitle = rom.title.toLowerCase().includes(q);
      const matchFile = rom.filename.toLowerCase().includes(q);
      const matchConsole = rom.console?.toLowerCase().includes(q);
      const matchExt = rom.file_extension?.toLowerCase().includes(q);
      const matchType = rom.package_type.toLowerCase().includes(q);
      if (!matchTitle && !matchFile && !matchConsole && !matchExt && !matchType) return false;
    }
    if (filterConsole !== 'all' && rom.console !== filterConsole) return false;
    if (filterExt !== 'all' && rom.file_extension !== filterExt) return false;
    if (filterStatus !== 'all' && rom.status !== filterStatus) return false;
    if (filterType !== 'all' && rom.package_type !== filterType) return false;
    return true;
  }), [packages, debouncedSearch, filterConsole, filterExt, filterStatus, filterType]);

  const hasActiveFilters = debouncedSearch || filterConsole !== 'all' || filterExt !== 'all' || filterStatus !== 'all' || filterType !== 'all';

  const clearFilters = () => {
    setSearch('');
    setFilterConsole('all');
    setFilterExt('all');
    setFilterStatus('all');
    setFilterType('all');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-pixel text-sm text-primary glow-green">ROM LIBRARY</h1>
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground animate-blink">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-sm text-primary glow-green">ROM LIBRARY</h1>
        <span className="font-pixel text-[8px] text-muted-foreground">{filtered.length} ROM PACKAGES FOUND</span>
      </div>

      {/* Global Search & Filters */}
      <div className="pixel-border bg-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ROMs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-background border border-border px-10 py-2 font-retro text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-background border border-border px-3 py-1.5 font-retro text-sm text-foreground">
            <option value="all">All Types</option>
            <option value="file">Single Files</option>
            <option value="folder">Folder Packages</option>
          </select>
          <select value={filterConsole} onChange={e => setFilterConsole(e.target.value)} className="bg-background border border-border px-3 py-1.5 font-retro text-sm text-foreground">
            <option value="all">All Consoles</option>
            {consoles.map(c => <option key={c} value={c!}>{c}</option>)}
          </select>
          <select value={filterExt} onChange={e => setFilterExt(e.target.value)} className="bg-background border border-border px-3 py-1.5 font-retro text-sm text-foreground">
            <option value="all">All Extensions</option>
            {extensions.map(e => <option key={e} value={e!}>{e}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-background border border-border px-3 py-1.5 font-retro text-sm text-foreground">
            <option value="all">All Status</option>
            <option value="sorted">Sorted</option>
            <option value="duplicate">Duplicate</option>
            <option value="unsorted">Unsorted</option>
          </select>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="px-3 py-1.5 border border-destructive text-destructive font-retro text-sm hover:bg-destructive/10">
              ✖ Clear
            </button>
          )}
        </div>

        {/* Active filter tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {debouncedSearch && <span className="px-2 py-0.5 bg-primary/10 border border-primary text-primary font-pixel text-[7px]">Query: {debouncedSearch}</span>}
            {filterType !== 'all' && <span className="px-2 py-0.5 bg-retro-magenta/10 border border-retro-magenta text-retro-magenta font-pixel text-[7px]">Type: {filterType}</span>}
            {filterConsole !== 'all' && <span className="px-2 py-0.5 bg-retro-cyan/10 border border-retro-cyan text-retro-cyan font-pixel text-[7px]">Console: {filterConsole}</span>}
            {filterExt !== 'all' && <span className="px-2 py-0.5 bg-retro-amber/10 border border-retro-amber text-retro-amber font-pixel text-[7px]">Ext: {filterExt}</span>}
            {filterStatus !== 'all' && <span className="px-2 py-0.5 bg-retro-blue/10 border border-retro-blue text-retro-blue font-pixel text-[7px]">Status: {filterStatus}</span>}
          </div>
        )}
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
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <PackageTypeBadge type={rom.package_type} totalFiles={rom.total_files} />
              {rom.console && <span className="font-pixel text-[8px] text-retro-cyan">{rom.console}</span>}
              {rom.file_extension && <ExtensionBadge ext={rom.file_extension} />}
            </div>
            {rom.detection_source && (
              <p className="font-pixel text-[7px] text-muted-foreground mb-1">Detected from {rom.detection_source}</p>
            )}
            {(rom.region || rom.language) && (
              <div className="flex items-center gap-2 mb-2 text-xs font-mono text-muted-foreground">
                {rom.region && <span className="text-retro-amber">{rom.region}</span>}
                {rom.language && <span className="text-retro-magenta">{rom.language}</span>}
              </div>
            )}
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>{formatFileSize(Number(rom.file_size))} {rom.total_files > 1 && `· ${rom.total_files} files`}</span>
              <span>{new Date(rom.upload_date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground">NO ROM PACKAGES FOUND</p>
        </div>
      )}
    </div>
  );
}
