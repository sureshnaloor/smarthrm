import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function Messages() {
  const { user } = useAuth();
  
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user?.employee,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="text-destructive" />;
      case "warning":
        return <AlertCircle className="text-warning" />;
      case "announcement":
        return <Bell className="text-primary" />;
      default:
        return <Info className="text-accent" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-destructive/10 text-destructive";
      case "warning":
        return "bg-warning/10 text-warning";
      case "announcement":
        return "bg-primary/10 text-primary";
      default:
        return "bg-accent/10 text-accent";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="spinner"></div>
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
          <div>
            <h1 className="page-header">Messages & Notifications</h1>
            <p className="page-subtitle">Stay updated with company announcements and personal messages</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                    <p className="text-xl font-bold text-foreground">{notifications?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <Bell className="text-destructive text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unread</p>
                    <p className="text-xl font-bold text-foreground">
                      {notifications?.filter((n: any) => !n.isRead).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-warning text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgent</p>
                    <p className="text-xl font-bold text-foreground">
                      {notifications?.filter((n: any) => n.type === "urgent").length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Bell className="text-accent text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Announcements</p>
                    <p className="text-xl font-bold text-foreground">
                      {notifications?.filter((n: any) => n.type === "announcement").length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Notifications</CardTitle>
                <Button variant="outline" size="sm">
                  Mark All as Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!notifications || notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification: any) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border border-border rounded-lg transition-colors ${
                        !notification.isRead ? "bg-accent/5 border-primary/20" : "hover:bg-accent/5"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          !notification.isRead ? "bg-primary" : "bg-muted-foreground"
                        }`}></div>
                        
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" 
                             style={{ backgroundColor: `hsl(var(--${notification.type === "urgent" ? "destructive" : notification.type === "warning" ? "warning" : notification.type === "announcement" ? "primary" : "accent"}) / 0.1)` }}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Badge className={getNotificationBadgeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                              </span>
                            </div>
                          </div>
                          
                          <p className={`text-sm mb-3 ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                            {notification.message}
                          </p>

                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                              disabled={markAsReadMutation.isPending}
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
