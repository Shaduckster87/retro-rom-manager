import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Upload, Library, Search, Copy, AlertTriangle,
  Gamepad2, FolderOpen, Settings, LogOut
} from 'lucide-react';
import { CRTToggle, useCrt } from './CRTToggle';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard, adminOnly: false },
  { title: 'Upload', path: '/upload', icon: Upload, adminOnly: true },
  { title: 'Library', path: '/library', icon: Library, adminOnly: false },
  { title: 'Duplicates', path: '/duplicates', icon: Copy, adminOnly: false },
  { title: 'Review', path: '/review', icon: AlertTriangle, adminOnly: false },
  { title: 'Consoles', path: '/consoles', icon: Gamepad2, adminOnly: false },
  { title: 'Explorer', path: '/explorer', icon: FolderOpen, adminOnly: false },
  { title: 'Settings', path: '/settings', icon: Settings, adminOnly: true },
];

export function RetroLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const crtEnabled = useCrt();
  const { isAdmin, user, signOut } = useAuth();

  return (
    <div className={`flex min-h-screen w-full ${crtEnabled ? 'crt-effect' : ''}`}>
      <aside className="w-56 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="font-pixel text-xs text-primary glow-green leading-relaxed">
            🎮 ROM<br />VAULT
          </h1>
          <p className="text-[10px] font-pixel text-muted-foreground mt-1">v3.0.0</p>
        </div>

        <nav className="flex-1 py-2">
          {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map((item) => {
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

        <div className="p-3 border-t border-border space-y-2">
          {user && (
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[7px] text-muted-foreground truncate">{user.email}</span>
              <button onClick={signOut} className="p-1 text-muted-foreground hover:text-destructive">
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          )}
          <CRTToggle />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
