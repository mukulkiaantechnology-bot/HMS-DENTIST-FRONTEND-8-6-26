import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, HeartPulse, LayoutDashboard, Calendar, Activity, CreditCard, FileText, Folder } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import { useDentistStore } from '../../store/dentistStore';
import { PatientSidebar } from './PatientSidebar';
import { ToastContainer } from '../../shared/ui/Toast';
import { Button } from '../../shared/ui/Button';

export function PatientLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const fetchPatientData = usePatientStore((state) => state.fetchPatientData);

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

  // Sync Patient state based on user email context
  useEffect(() => {
    if (user) {
      const dentistStore = useDentistStore.getState();
      const matched = dentistStore.patients.find(
        (p) => p.email?.toLowerCase() === user.email?.toLowerCase()
      );
      const patientId = matched ? matched.id : 'pat-1';
      fetchPatientData(patientId);
    }
  }, [user, fetchPatientData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const mobileNavItems = [
    { label: 'Dash', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Appts', path: '/patient/appointments', icon: Calendar },
    { label: 'Care', path: '/patient/treatment', icon: Activity },
    { label: 'Bills', path: '/patient/billing', icon: CreditCard },
    { label: 'Rx', path: '/patient/prescriptions', icon: FileText },
    { label: 'Files', path: '/patient/reports', icon: Folder }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex">
        <PatientSidebar />
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header toolbar */}
        <header className="h-16 border-b border-border bg-card text-foreground px-4 sm:px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            {/* Mobile-only Portal Icon */}
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg md:hidden">
              <HeartPulse className="h-5 w-5" />
            </div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent uppercase">
              HMS CoreSaaS Portal
            </h1>
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
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </Button>

            <div className="h-6 w-px bg-border my-auto mx-0.5" />

            {/* User Details */}
            <div className="flex items-center gap-2 text-left hidden sm:flex">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-border"
              />
              <div className="leading-tight">
                <h4 className="text-xs font-bold text-foreground">{user.name}</h4>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-extrabold">Patient Console</p>
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col text-left">
            {children || <Outlet />}
          </div>
        </main>

        {/* Mobile bottom nav bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border py-2 px-4 flex items-center justify-around md:hidden shadow-lg">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 text-center transition-all ${
                  isActive ? 'text-primary scale-105' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="text-[9px] font-bold tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Toast Alert Popups */}
      <ToastContainer />
    </div>
  );
}

export default PatientLayout;
