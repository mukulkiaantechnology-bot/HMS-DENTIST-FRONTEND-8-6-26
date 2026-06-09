import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import { cn } from '../../shared/utils/cn';

export function PatientSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { patientProfile } = usePatientStore();

  if (!user) return null;

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/patient/dashboard' },
    { key: 'appointments', label: 'Appointments', icon: 'Calendar', path: '/patient/appointments' },
    { key: 'treatment', label: 'Treatment Plan', icon: 'Activity', path: '/patient/treatment' },
    { key: 'billing', label: 'Billing & Payments', icon: 'CreditCard', path: '/patient/billing' },
    { key: 'prescriptions', label: 'Prescriptions', icon: 'FileText', path: '/patient/prescriptions' },
    { key: 'reports', label: 'Reports & X-Rays', icon: 'Folder', path: '/patient/reports' }
  ];

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-card border-r border-border text-foreground transition-all duration-300 relative z-30',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2 select-none">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
              <Icons.HeartPulse className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xs tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent uppercase">
              PATIENT PORTAL
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Icons.HeartPulse className="h-5 w-5" />
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
            Dental Patient
          </div>
          <div className="text-xs font-extrabold text-foreground truncate">
            {patientProfile?.name || user.name}
          </div>
          {patientProfile?.allergies && patientProfile.allergies !== 'None' && (
            <div className="mt-2 pt-2 border-t border-border/40 text-[9px] text-rose-500 flex items-center gap-1">
              <Icons.AlertTriangle className="h-3 w-3" />
              <span>Allergy: <strong>{patientProfile.allergies}</strong></span>
            </div>
          )}
        </div>
      ) : (
        <div className="my-4 flex justify-center" title="Patient Workspace Active">
          <Icons.ShieldCheck className="h-4 w-4 text-emerald-500 animate-pulse" />
        </div>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const IconComp = Icons[item.icon] || Icons.HelpCircle;

          return (
            <NavLink
              key={item.key}
              to={item.path}
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
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover border border-border flex-shrink-0"
            />
            <div className="overflow-hidden flex-1">
              <h4 className="text-xs font-bold text-foreground truncate">{patientProfile?.name || user.name}</h4>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover border border-border mx-auto"
          />
        )}
      </div>
    </aside>
  );
}
export default PatientSidebar;
