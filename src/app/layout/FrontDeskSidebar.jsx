import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../shared/utils/cn';

export function FrontDeskSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) return null;

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/frontdesk/dashboard' },
    { key: 'appointments', label: 'Appointments', icon: 'Calendar', path: '/frontdesk/appointments' },
    { key: 'registration', label: 'Registration', icon: 'UserPlus', path: '/frontdesk/registration' },
    { key: 'insurance', label: 'Insurance', icon: 'FileShield', path: '/frontdesk/insurance' },
    { key: 'waitlist', label: 'Waitlist', icon: 'Clock', path: '/frontdesk/waitlist' }
  ];

  return (
    <>
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen bg-card border-r border-border text-foreground transition-all duration-300 relative z-30',
          isCollapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2 select-none">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                <Icons.Sparkles className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                RECEPTION PORTAL
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Icons.Sparkles className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Collapse Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-card border border-border text-muted-foreground hover:text-foreground h-6 w-6 rounded-full flex items-center justify-center cursor-pointer shadow-sm z-40 hover:scale-105 transition-transform"
        >
          {isCollapsed ? <Icons.ChevronRight className="h-3 w-3" /> : <Icons.ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Active Session Info */}
        {!isCollapsed ? (
          <div className="p-4 mx-4 my-3 rounded-lg bg-muted/50 border border-border/40 text-left">
            <div className="text-[9px] uppercase font-bold tracking-widest text-primary mb-0.5">
              Active Registrar
            </div>
            <div className="text-xs font-extrabold text-foreground truncate">
              {user.name}
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground font-semibold">
              Vance Dental Clinic HQ
            </div>
          </div>
        ) : (
          <div className="my-4 flex justify-center" title="Reception desk active">
            <Icons.ShieldCheck className="h-4 w-4 text-primary animate-pulse" />
          </div>
        )}

        {/* Nav Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const IconComp = Icons[item.icon] || Icons.HelpCircle;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <IconComp className="h-4.5 w-4.5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 bg-popover text-popover-foreground text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-border">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3 text-left w-full overflow-hidden">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover border border-border flex-shrink-0"
              />
              <div className="overflow-hidden flex-1">
                <h4 className="text-xs font-bold text-foreground truncate">{user.name}</h4>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover border border-border mx-auto"
            />
          )}
        </div>
      </aside>

      {/* 2. MOBILE BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-40 md:hidden pb-safe shadow-lg px-2">
        {menuItems.map((item) => {
          const IconComp = Icons[item.icon] || Icons.HelpCircle;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-150',
                isActive
                  ? 'text-primary scale-105 font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <IconComp className="h-5 w-5 mb-0.5" />
              <span className="text-[9px] uppercase font-bold tracking-wider">{item.key}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}
export default FrontDeskSidebar;
