import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Sun, Moon, LogOut, Tag, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLabStore } from '../../store/labStore';
import { LabSidebar } from './LabSidebar';
import { ToastContainer } from '../../shared/ui/Toast';
import { Button } from '../../shared/ui/Button';

export function LabCoordinatorLayout({ children }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { labCases, activeCaseId, setActiveCaseId } = useLabStore();

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('hms_theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hms_theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCaseChange = (e) => {
    const id = e.target.value;
    setActiveCaseId(id);
  };

  if (!user) return null;

  const activeCase = labCases.find((c) => c.id === activeCaseId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none">
      {/* Sidebar */}
      <LabSidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scoped Patient Header */}
        <header className="h-16 border-b border-border bg-card text-foreground px-4 sm:px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4 flex-1">
            {/* Active Case switcher context */}
            <div className="flex items-center gap-2 bg-muted/60 border border-border px-3 py-1 rounded-xl">
              <Tag className="h-4 w-4 text-primary" />
              <select
                value={activeCaseId || ''}
                onChange={handleCaseChange}
                className="bg-transparent border-none text-xs font-bold focus:outline-none cursor-pointer max-w-[200px] text-foreground"
              >
                <option value="" disabled className="bg-card">-- Select Case --</option>
                {labCases.map((c) => (
                  <option key={c.id} value={c.id} className="bg-card">
                    {c.patientName} ({c.type} - #{c.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick lab info preview in header */}
            {activeCase ? (
              <div className="hidden lg:flex items-center gap-3 text-left text-[11px] leading-none border-l border-border pl-4">
                <div>
                  <span className="text-muted-foreground font-semibold">Laboratory:</span>
                  <span className="ml-1 font-extrabold text-foreground">
                    {activeCase.labName}
                  </span>
                </div>
                <div className="h-4 w-px bg-border/60" />
                <div>
                  <span className="text-muted-foreground font-semibold">Status:</span>
                  <span className={`ml-1 font-bold ${
                    activeCase.status === 'Delivered'
                      ? 'text-emerald-500'
                      : activeCase.status === 'In Progress'
                      ? 'text-yellow-500 animate-pulse'
                      : activeCase.status === 'Sent'
                      ? 'text-orange-500'
                      : 'text-blue-500'
                  }`}>
                    {activeCase.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1 text-[11px] text-rose-500 font-bold">
                <AlertTriangle className="h-3.5 w-3.5" />
                Select a lab case to review production detail tracking.
              </div>
            )}
          </div>

          {/* Right hand controls */}
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Icons className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </Button>

            <div className="h-6 w-px bg-border my-auto mx-0.5" />

            {/* User Details */}
            <div className="flex items-center gap-2 text-left hidden sm:flex">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-border"
              />
              <div className="leading-tight">
                <h4 className="text-xs font-bold text-foreground">{user.name}</h4>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-extrabold">Lab Coordinator</p>
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-9 px-3 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline font-semibold">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Work Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col text-left">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Toast Alert Popups */}
      <ToastContainer />
    </div>
  );
}

// Quick inline icon component to avoid unused-vars for Moon/Sun import conflicts
function Icons({ className }) {
  return <Moon className={className} />;
}

export default LabCoordinatorLayout;
