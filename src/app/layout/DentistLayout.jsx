import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Sun, Moon, LogOut, Users, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDentistStore } from '../../store/dentistStore';
import { DentistSidebar } from './DentistSidebar';
import { ToastContainer } from '../../shared/ui/Toast';
import { Button } from '../../shared/ui/Button';

export function DentistLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { patients, activePatientId, setActivePatientId } = useDentistStore();

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

  const handlePatientChange = (e) => {
    const id = e.target.value;
    setActivePatientId(id);
    
    // Maintain current sub-tab during context switch
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab') || 'overview';
    navigate(`/dentist/patients/${id}?tab=${tab}`);
  };

  if (!user) return null;

  const activePatient = patients.find((p) => p.id === activePatientId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none">
      {/* Dentist Sidebar */}
      <DentistSidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scoped Patient Header */}
        <header className="h-16 border-b border-border bg-card text-foreground px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4 flex-1">
            {/* Active Patient switcher context */}
            <div className="flex items-center gap-2 bg-muted/60 border border-border px-3 py-1 rounded-xl">
              <Users className="h-4 w-4 text-primary" />
              <select
                value={activePatientId || ''}
                onChange={handlePatientChange}
                className="bg-transparent border-none text-xs font-bold focus:outline-none cursor-pointer max-w-[180px] text-foreground"
              >
                <option value="" disabled className="bg-card">-- Select Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id} className="bg-card">
                    {p.name} (#{p.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick vitals & allergy preview in header */}
            {activePatient ? (
              <div className="hidden lg:flex items-center gap-3 text-left text-[11px] leading-none border-l border-border pl-4">
                <div>
                  <span className="text-muted-foreground font-semibold">Allergies:</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full font-extrabold ${
                    activePatient.allergies === 'None'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-rose-500/10 text-rose-500 animate-pulse'
                  }`}>
                    {activePatient.allergies}
                  </span>
                </div>
                <div className="h-4 w-px bg-border/60" />
                <div>
                  <span className="text-muted-foreground font-semibold">Vitals:</span>
                  <span className="ml-1 font-bold text-foreground">{activePatient.vitals}</span>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1 text-[11px] text-rose-500 font-bold">
                <AlertTriangle className="h-3.5 w-3.5" />
                Select a patient to begin clinical documentation
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
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <div className="h-6 w-px bg-border my-auto mx-1" />

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-9 px-3 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline font-semibold">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Work Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Toast Alert Popups */}
      <ToastContainer />
    </div>
  );
}
export default DentistLayout;
