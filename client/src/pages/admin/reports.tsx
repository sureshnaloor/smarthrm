import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Download, Users, Building, TrendingUp, Calendar } from "lucide-react";

export default function AdminReports() {
  const { user } = useAuth();

  const { data: employees } = useQuery({
    queryKey: ["/api/admin/employees"],
    enabled: !!user?.employee?.isAdmin,
  });

  const { data: adminStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.employee?.isAdmin,
  });

  // Process data for charts
  const departmentData = employees?.reduce((acc: any, emp: any) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const departmentChartData = Object.entries(departmentData || {}).map(([dept, count]) => ({
    department: dept,
    employees: count,
  }));

  const statusData = employees?.reduce((acc: any, emp: any) => {
    acc[emp.status] = (acc[emp.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData || {}).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  if (user?.employee?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-header">Reports & Analytics</h1>
              <p className="page-subtitle">View company statistics and generate reports</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="monthly">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
                    <p className="text-2xl font-bold text-foreground">{adminStats?.totalEmployees || 0}</p>
                    <p className="text-xs text-accent">+5% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="text-primary text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">New Hires</p>
                    <p className="text-2xl font-bold text-foreground">{adminStats?.newHires || 0}</p>
                    <p className="text-xs text-accent">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-accent text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Departments</p>
                    <p className="text-2xl font-bold text-foreground">{departmentChartData.length}</p>
                    <p className="text-xs text-muted-foreground">Active departments</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Building className="text-secondary text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg. Tenure</p>
                    <p className="text-2xl font-bold text-foreground">2.4</p>
                    <p className="text-xs text-muted-foreground">Years</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Calendar className="text-warning text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Employees by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="employees" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Employee Status */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Details */}
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground border-b">
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Total Employees</th>
                      <th className="pb-3">Active</th>
                      <th className="pb-3">Average Salary</th>
                      <th className="pb-3">New Hires (30d)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {departmentChartData.map((dept: any) => {
                      const deptEmployees = employees?.filter((emp: any) => emp.department === dept.department) || [];
                      const activeCount = deptEmployees.filter(emp => emp.status === "active").length;
                      const avgSalary = deptEmployees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0) / deptEmployees.length;
                      
                      return (
                        <tr key={dept.department} className="text-sm">
                          <td className="py-4 font-medium">{dept.department}</td>
                          <td className="py-4">{dept.employees}</td>
                          <td className="py-4">{activeCount}</td>
                          <td className="py-4">${avgSalary ? avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "N/A"}</td>
                          <td className="py-4">0</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-center space-x-2 h-20">
                  <FileText className="w-6 h-6" />
                  <span>Employee Directory</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2 h-20">
                  <FileText className="w-6 h-6" />
                  <span>Payroll Summary</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2 h-20">
                  <FileText className="w-6 h-6" />
                  <span>Time Off Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
