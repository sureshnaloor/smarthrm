import React from "react";
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
  LogOut,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Folder,
  Settings,
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

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Performance",
    href: "/performance",
    icon: BarChart3,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    name: "Timesheet",
    href: "/timesheet",
    icon: Clock,
  },
  {
    name: "Records",
    href: "/records",
    icon: FileText,
  },
  {
    name: "Pay",
    href: "/pay",
    icon: DollarSign,
  },
  {
    name: "Leave",
    href: "/leave",
    icon: Calendar,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: Folder,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const isAdmin = user?.employee?.isAdmin || false;

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <div className="absolute right-2 w-1 h-6 bg-white rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
              U
            </div>
            <div>
              <p className="text-sm font-medium text-white">User Name</p>
              <p className="text-xs text-gray-400">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
