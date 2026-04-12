import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Upload, Library, Search, Copy, AlertTriangle,
  Gamepad2, FolderOpen, Settings, Monitor
} from 'lucide-react';
import { CRTToggle, useCrt } from './CRTToggle';

const NAV_ITEMS = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Upload', path: '/upload', icon: Upload },
  { title: 'Library', path: '/library', icon: Library },
  { title: 'Duplicates', path: '/duplicates', icon: Copy },
  { title: 'Review', path: '/review', icon: AlertTriangle },
  { title: 'Consoles', path: '/consoles', icon: Gamepad2 },
  { title: 'Explorer', path: '/explorer', icon: FolderOpen },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export function RetroLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const crtEnabled = useCrt();

  return (
    <div className={`flex min-h-screen w-full ${crtEnabled ? 'crt-effect' : ''}`}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="font-pixel text-xs text-primary glow-green leading-relaxed">
            🎮 ROM<br />VAULT
          </h1>
          <p className="text-[10px] font-pixel text-muted-foreground mt-1">v2.4.1</p>
        </div>

        <nav className="flex-1 py-2">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-retro transition-colors border-l-2 ${
                  active
                    ? 'border-primary text-primary bg-primary/10 glow-green'
                    : 'border-transparent text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <CRTToggle />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
