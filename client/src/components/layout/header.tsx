import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Menu, Users } from "lucide-react";
import { format } from "date-fns";

export default function Header() {
  const { user } = useAuth();

  const { data: unreadCount } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
    enabled: !!user?.employee,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentNotifications } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user?.employee,
    select: (data) => data?.slice(0, 5), // Show only 5 most recent
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const toggleMobileMenu = () => {
    const sidebar = document.querySelector('aside');
    const overlay = document.getElementById('mobile-overlay');
    
    if (sidebar && overlay) {
      sidebar.classList.toggle('-translate-x-full');
      overlay.classList.toggle('hidden');
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "??";
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <>
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={toggleMobileMenu}
              >
                <Menu className="text-foreground" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="text-primary-foreground text-sm" />
                </div>
                <h1 className="text-xl font-bold text-foreground">HRConnect</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="text-foreground" />
                    {unreadCount?.count > 0 && (
                      <Badge className="notification-dot">
                        {unreadCount.count}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    {unreadCount?.count > 0 && (
                      <p className="text-sm text-muted-foreground">
                        You have {unreadCount.count} unread notification{unreadCount.count > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {!recentNotifications || recentNotifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {recentNotifications.map((notification: any) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-accent/5 transition-colors ${
                              !notification.isRead ? "bg-accent/5" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                !notification.isRead ? "bg-primary" : "bg-muted-foreground"
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  !notification.isRead ? "text-foreground" : "text-muted-foreground"
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                                </p>
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 h-6 px-2 text-xs"
                                    onClick={() => markAsReadMutation.mutate(notification.id)}
                                    disabled={markAsReadMutation.isPending}
                                  >
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {recentNotifications && recentNotifications.length > 0 && (
                    <div className="p-4 border-t border-border">
                      <Button variant="ghost" size="sm" className="w-full text-sm">
                        View all notifications
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.employee?.isAdmin ? "Admin" : "Employee"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(user?.firstName, user?.lastName)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div id="mobile-overlay" className="fixed inset-0 bg-black bg-opacity-50 z-20 hidden lg:hidden"></div>
    </>
  );
}
