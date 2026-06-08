import { useState } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Header } from './Header';
import { ToastContainer } from '../../shared/ui/Toast';
import { Outlet } from 'react-router-dom';

export function SuperAdminLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Super Admin Collapsible Sidebar (Drawer on mobile) */}
      <SuperAdminSidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Primary Work area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Profile and Switcher and Hamburger */}
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
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
export default SuperAdminLayout;
