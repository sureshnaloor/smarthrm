import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  Plane, 
  MessageCircle, 
  Download, 
  CalendarPlus, 
  Edit, 
  Headphones,
  FileText,
  Bell,
  Info,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const { data: latestPay } = useQuery({
    queryKey: ["/api/pay/latest"],
    enabled: !!user?.employee,
  });

  const { data: payRecords } = useQuery({
    queryKey: ["/api/pay/records"],
    enabled: !!user?.employee,
    select: (data) => data?.slice(0, 2), // Show only 2 most recent
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user?.employee,
    select: (data) => data?.slice(0, 2), // Show only 2 most recent
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
    enabled: !!user?.employee,
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="text-destructive" />;
      case "warning":
        return <AlertTriangle className="text-warning" />;
      case "announcement":
        return <Bell className="text-primary" />;
      default:
        return <Info className="text-accent" />;
    }
  };

  const calculateNextPayday = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    // Assume pay dates are 15th and last day of month
    let nextPayday;
    if (day <= 15) {
      nextPayday = new Date(year, month, 15);
    } else {
      // Last day of current month
      nextPayday = new Date(year, month + 1, 0);
    }
    
    return nextPayday;
  };

  const calculateVacationDays = () => {
    // This would normally come from the database
    // For now, calculate based on start date and company policy
    const startDate = user?.employee?.startDate ? new Date(user.employee.startDate) : new Date();
    const now = new Date();
    const yearsEmployed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    // Assume 20 days per year, prorated
    const totalDays = Math.floor(yearsEmployed * 20);
    const usedDays = 8; // This would come from time off requests
    
    return {
      total: Math.min(totalDays, 20), // Cap at 20 days
      remaining: Math.max(totalDays - usedDays, 0),
    };
  };

  const nextPayday = calculateNextPayday();
  const vacationDays = calculateVacationDays();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="hr-gradient rounded-2xl p-8 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || "Employee"}!
            </h2>
            <p className="text-primary-foreground/80 mb-4">
              Here's your employment overview for today
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="text-primary-foreground/60">Employee ID:</span>
                <span className="font-medium ml-1">{user?.employee?.employeeId || "N/A"}</span>
              </div>
              <div>
                <span className="text-primary-foreground/60">Department:</span>
                <span className="font-medium ml-1">{user?.employee?.department || "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary-foreground/30 flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Payday</p>
                <p className="text-xl font-bold text-foreground">
                  {format(nextPayday, "MMM d, yyyy")}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-accent text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Annual Salary</p>
                <p className="text-xl font-bold text-foreground">
                  ${Number(user?.employee?.salary || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-primary text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vacation Days</p>
                <p className="text-xl font-bold text-foreground">
                  {vacationDays.remaining} / {vacationDays.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Plane className="text-warning text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Unread Messages</p>
                <p className="text-xl font-bold text-foreground">
                  {unreadCount?.count || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-destructive text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Pay Stubs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Pay Stubs</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!payRecords || payRecords.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pay stubs available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payRecords.map((stub: any) => (
                  <div key={stub.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <FileText className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {format(new Date(stub.payPeriodStart), "MMMM yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {stub.payType} Pay
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        ${Number(stub.netPay).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Net Pay</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Notifications</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!notifications || notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification: any) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.isRead ? "bg-primary" : "bg-muted-foreground"
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="quick-action-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Download className="text-primary text-xl" />
              </div>
              <span className="text-sm font-medium text-foreground">Download Pay Stub</span>
            </Button>
            
            <Button variant="outline" className="quick-action-card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <CalendarPlus className="text-accent text-xl" />
              </div>
              <span className="text-sm font-medium text-foreground">Request Time Off</span>
            </Button>
            
            <Button variant="outline" className="quick-action-card">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-3">
                <Edit className="text-warning text-xl" />
              </div>
              <span className="text-sm font-medium text-foreground">Update Profile</span>
            </Button>
            
            <Button variant="outline" className="quick-action-card">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-3">
                <Headphones className="text-destructive text-xl" />
              </div>
              <span className="text-sm font-medium text-foreground">Contact HR</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
