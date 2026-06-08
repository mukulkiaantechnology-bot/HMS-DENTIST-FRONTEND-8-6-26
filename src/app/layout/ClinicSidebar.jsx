import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getAllowedRoutes, ROLE_LABELS } from '../../shared/utils/permissions';
import { cn } from '../../shared/utils/cn';

export function ClinicSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const allowedRoutes = getAllowedRoutes(user.role);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-card border-r border-border text-foreground transition-all duration-300 relative',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2 select-none">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
              <Icons.Activity className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              CLINIC WORKSPACE
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Icons.Activity className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Collapse Toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-card border border-border text-muted-foreground hover:text-foreground h-6 w-6 rounded-full flex items-center justify-center cursor-pointer shadow-sm z-20 hover:scale-105 transition-transform"
      >
        {isCollapsed ? <Icons.ChevronRight className="h-3 w-3" /> : <Icons.ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Role Badge */}
      {!isCollapsed ? (
        <div className="p-4 mx-4 my-3 rounded-lg bg-muted/50 border border-border/40 text-left">
          <div className="text-[9px] uppercase font-bold tracking-widest text-primary mb-0.5">
            Clinic Panel
          </div>
          <div className="text-xs font-extrabold text-foreground truncate">
            {ROLE_LABELS[user.role] || 'Clinic Admin'}
          </div>
        </div>
      ) : (
        <div className="my-4 flex justify-center" title="Clinic Access Active">
          <Icons.ShieldAlert className="h-4 w-4 text-primary animate-pulse" />
        </div>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
        {allowedRoutes.map((route) => {
          const IconComp = Icons[route.icon] || Icons.HelpCircle;

          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <IconComp className="h-4.5 w-4.5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{route.label}</span>}
              {isCollapsed && (
                <div className="absolute left-16 bg-popover text-popover-foreground text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30 border border-border">
                  {route.label}
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
              src={user.avatarUrl}
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
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover border border-border mx-auto"
          />
        )}
      </div>
    </aside>
  );
}
export default ClinicSidebar;
