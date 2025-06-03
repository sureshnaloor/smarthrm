import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNotificationSchema } from "@shared/schema";
import { Bell, Plus, Send, Users, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

const notificationFormSchema = insertNotificationSchema.pick({
  title: true,
  message: true,
  type: true,
  recipientId: true,
});

export default function AdminNotifications() {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/admin/notifications/company"],
    enabled: !!user?.employee?.isAdmin,
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/admin/employees"],
    enabled: !!user?.employee?.isAdmin,
  });

  const createNotificationMutation = useMutation({
    mutationFn: (data: z.infer<typeof notificationFormSchema>) => 
      apiRequest("POST", "/api/admin/notifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications/company"] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "info",
      recipientId: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    createNotificationMutation.mutate({
      ...data,
      recipientId: data.recipientId === "all" ? undefined : parseInt(data.recipientId as string),
    });
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-header">Notification Management</h1>
              <p className="page-subtitle">Send announcements and notifications to employees</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Notification</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Notification title" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Notification message content"
                              rows={4}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select notification type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="announcement">Announcement</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="recipientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue="all">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select recipient" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all">All Employees</SelectItem>
                                {employees?.map((employee: any) => (
                                  <SelectItem key={employee.id} value={employee.id.toString()}>
                                    {employee.firstName} {employee.lastName} ({employee.employeeId})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createNotificationMutation.isPending}>
                        <Send className="w-4 h-4 mr-2" />
                        {createNotificationMutation.isPending ? "Sending..." : "Send Notification"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bell className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Notifications</p>
                    <p className="text-xl font-bold text-foreground">{notifications?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Info className="text-accent text-lg" />
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
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Users className="text-secondary text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-xl font-bold text-foreground">
                      {notifications?.filter((n: any) => n.isActive).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {!notifications || notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications sent yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification: any) => (
                    <div key={notification.id} className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`} 
                             style={{ backgroundColor: `hsl(var(--${notification.type === "urgent" ? "destructive" : notification.type === "warning" ? "warning" : notification.type === "announcement" ? "primary" : "accent"}) / 0.1)` }}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-foreground">
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Badge className={getNotificationBadgeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                              {notification.recipientId ? (
                                <Badge variant="outline">Individual</Badge>
                              ) : (
                                <Badge variant="outline">Company-wide</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              Status: {notification.isActive ? "Active" : "Inactive"}
                            </span>
                            {notification.expiresAt && (
                              <span>
                                Expires: {format(new Date(notification.expiresAt), "MMM d, yyyy")}
                              </span>
                            )}
                          </div>
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
