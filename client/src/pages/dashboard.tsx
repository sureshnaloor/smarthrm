import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { api } from "../lib/api";
import EmployeeDashboard from "@/components/dashboard/employee-dashboard";

export default function DashboardPage() {
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">HRConnect</h1>
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => setLocation("/performance")}>
                  Performance
                </Button>
                <Button variant="ghost" onClick={() => setLocation("/messages")}>
                messages
                </Button>
                <Button variant="ghost" onClick={() => setLocation("/timesheet")}>
                  timesheet
                </Button>
                <Button variant="ghost" onClick={() => setLocation("/records")}>
                  records
                </Button>
                <Button variant="ghost" onClick={() => setLocation("/pay")}>
                  Pay
                </Button>
                <Button variant="ghost" onClick={() => setLocation("/leave")}>
                  Leave
                </Button>
                <Button variant="ghost" onClick={() => setLocation("/documents")}>
                  Documents
                </Button>
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <EmployeeDashboard />
    <div >
     

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
           

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">No recent activity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">No upcoming events</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}
