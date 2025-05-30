import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { 
  Home, 
  DollarSign, 
  FolderOpen, 
  MessageCircle, 
  Target,
  Calendar,
  Clock,
  Users, 
  Megaphone, 
  BarChart3,
  LogOut
} from "lucide-react";

const employeeNavItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/pay", label: "Pay & Benefits", icon: DollarSign },
  { path: "/records", label: "My Records", icon: FolderOpen },
  { path: "/messages", label: "Messages", icon: MessageCircle },
  { path: "/performance", label: "Performance Reviews", icon: Target },
  { path: "/leave", label: "Leave Management", icon: Calendar },
  { path: "/timesheet", label: "Timesheet & Payroll", icon: Clock },
];

const adminNavItems = [
  { path: "/admin/employees", label: "All Employees", icon: Users },
  { path: "/admin/notifications", label: "Send Notifications", icon: Megaphone },
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const isAdmin = user?.employee?.isAdmin || false;

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <aside className="w-64 bg-card shadow-sm border-r border-border min-h-screen fixed lg:static lg:translate-x-0 transform -translate-x-full transition-transform z-30">
      <nav className="p-6">
        <ul className="space-y-2">
          {/* Employee Navigation */}
          {employeeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <li key={item.path}>
                <Link href={item.path} className={cn("nav-link", isActive && "active")}>
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}

          {/* Admin Navigation */}
          {isAdmin && (
            <li className="pt-4 border-t border-border">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </p>
              <ul className="space-y-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  
                  return (
                    <li key={item.path}>
                      <Link href={item.path} className={cn("nav-link", isActive && "active")}>
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          )}
        </ul>

        {/* Logout */}
        <div className="mt-8 pt-8 border-t border-border">
          <button 
            onClick={handleLogout}
            className="nav-link w-full text-left hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
