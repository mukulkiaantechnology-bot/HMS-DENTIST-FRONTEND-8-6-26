import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useClinicOwnerStore } from '../../store/clinicOwnerStore';
import { Button } from '../../shared/ui/Button';

export function ClinicHeader() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const settings = useClinicOwnerStore((state) => state.settings);

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

  if (!user) return null;

  return (
    <header className="h-16 border-b border-border bg-card text-foreground px-6 flex items-center justify-between z-40 select-none">
      {/* Scoped Clinic Profile Context */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-extrabold text-foreground leading-none">{settings.name}</h3>
          <span className="text-[10px] text-muted-foreground font-semibold block mt-1">{settings.address} &bull; {settings.hours}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
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

        {/* Log Out */}
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
  );
}
export default ClinicHeader;
