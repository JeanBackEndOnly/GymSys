import React from 'react';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Footprints, 
  ClipboardCheck, 
  ShoppingBag, 
  BarChart3, 
  Bell, 
  UserCircle,
  LogOut,
  ChevronLeft,
  Settings,
  ShieldCheck,
  Wallet,
  Package,
  UserCog
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogoutModal } from '@/components/shared/LogoutModal';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Registered Users', path: '/admin/members' },
  { icon: CreditCard, label: 'Memberships', path: '/admin/memberships' },
  { icon: ClipboardCheck, label: 'Attendance', path: '/admin/attendance' },
  { icon: Wallet, label: 'Payments', path: '/admin/payments' },
  { icon: Footprints, label: 'Walk-ins', path: '/admin/walk-ins' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingBag, label: 'POS Sales', path: '/admin/pos' },
  { icon: UserCog, label: 'Staff Management', path: '/admin/staff' },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
];

export function AdminSidebar({ className }: { className?: string }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleSidebar = () => {
    setCollapsed((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem('sidebar_collapsed', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen shrink-0 z-20 transition-all duration-300 ease-in-out border-r border-white/5 matte-surface",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-5 h-16">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="size-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gradient">IRON ADMIN</span>
          </div>
        )}
        {collapsed && (
          <div className="size-8 rounded-lg bg-primary mx-auto flex items-center justify-center">
            <ShieldCheck className="size-5 text-primary-foreground" />
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3.5 top-16 size-7 rounded-full border border-white/10 bg-[#1a1a1a] text-white hover:bg-[#252525] hover:scale-110 transition-all z-30 shadow-xl hidden lg:flex"
        onClick={toggleSidebar}
      >
        <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
      </Button>

      <Separator className="bg-white/5 mx-4 w-auto" />

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto slim-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-white"
                )} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
                
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-primary rounded-full" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 space-y-2">
        <Separator className="bg-white/5" />
        <Link to="/admin/profile">
          <div className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-white/5 hover:text-white",
            location.pathname === '/admin/profile' && "bg-white/10 text-white"
          )}>
            <UserCircle className="size-5" />
            {!collapsed && <span className="font-medium">My Profile</span>}
          </div>
        </Link>
        <Link to="/admin/settings">
          <div className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-white/5 hover:text-white",
            location.pathname === '/admin/settings' && "bg-white/10 text-white"
          )}>
            <Settings className="size-5" />
            {!collapsed && <span className="font-medium">Settings</span>}
          </div>
        </Link>
        <LogoutModal>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start gap-3 px-3 py-5 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-5" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </Button>
        </LogoutModal>
      </div>
    </div>
  );
}
