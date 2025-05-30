import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  UserPlus, 
  Clock, 
  Megaphone, 
  AlertTriangle,
  Users,
  Building,
  FileBarChart,
  Settings,
  Search
} from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: adminStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.employee?.isAdmin,
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/admin/employees"],
    enabled: !!user?.employee?.isAdmin,
    select: (data) => data?.slice(0, 5), // Show only 5 most recent for dashboard
  });

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="admin-gradient rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-purple-100 mb-4">Manage employees and system notifications</p>
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="text-purple-200">Total Employees:</span>
                <span className="font-medium ml-1">{adminStats?.totalEmployees || 0}</span>
              </div>
              <div>
                <span className="text-purple-200">Active Users:</span>
                <span className="font-medium ml-1">{adminStats?.totalEmployees || 0}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="text-4xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">New Hires (This Month)</p>
                <p className="text-2xl font-bold text-foreground">{adminStats?.newHires || 0}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <UserPlus className="text-accent text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Approvals</p>
                <p className="text-2xl font-bold text-foreground">{adminStats?.pendingApprovals || 0}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="text-warning text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Notifications</p>
                <p className="text-2xl font-bold text-foreground">{adminStats?.activeNotifications || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Megaphone className="text-primary text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">System Alerts</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-destructive text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Management & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Employee Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Employee Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!employees || employees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No employee activity</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b">
                        <th className="pb-3">Employee</th>
                        <th className="pb-3">Department</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Start Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {employees.map((employee: any) => (
                        <tr key={employee.id} className="text-sm">
                          <td className="py-3">
                            <div className="flex items-center space-x-3">
                              <div className="employee-avatar bg-primary">
                                {employee.employeeId?.slice(-2) || "??"}
                              </div>
                              <span className="font-medium">{employee.employeeId}</span>
                            </div>
                          </td>
                          <td className="py-3">{employee.department}</td>
                          <td className="py-3">
                            <Badge className={employee.status === "active" ? "status-active" : "status-inactive"}>
                              {employee.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {employee.startDate ? format(new Date(employee.startDate), "MMM d, yyyy") : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full flex items-center space-x-3 p-4 h-auto">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UserPlus className="text-primary" />
                </div>
                <span className="font-medium text-foreground">Add New Employee</span>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center space-x-3 p-4 h-auto">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Megaphone className="text-accent" />
                </div>
                <span className="font-medium text-foreground">Send Notification</span>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center space-x-3 p-4 h-auto">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <FileBarChart className="text-warning" />
                </div>
                <span className="font-medium text-foreground">Generate Report</span>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center space-x-3 p-4 h-auto">
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Settings className="text-destructive" />
                </div>
                <span className="font-medium text-foreground">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Search & Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="mb-4 md:mb-0">Employee Directory</CardTitle>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!employees || employees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No employees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Position</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {employees.map((employee: any) => (
                    <tr key={employee.id} className="text-sm">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="employee-avatar bg-primary">
                            {employee.employeeId?.slice(-2) || "??"}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Employee {employee.employeeId}
                            </p>
                            <p className="text-muted-foreground">{employee.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{employee.department}</td>
                      <td className="py-4">{employee.position}</td>
                      <td className="py-4">
                        <Badge className={employee.status === "active" ? "status-active" : "status-inactive"}>
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
