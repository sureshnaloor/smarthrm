import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Pay from "@/pages/pay";
import Records from "@/pages/records";
import Messages from "@/pages/messages";
import Performance from "@/pages/performance";
import Leave from "@/pages/leave";
import AdminEmployees from "@/pages/admin/employees";
import AdminNotifications from "@/pages/admin/notifications";
import AdminReports from "@/pages/admin/reports";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/pay" component={Pay} />
          <Route path="/records" component={Records} />
          <Route path="/messages" component={Messages} />
          <Route path="/performance" component={Performance} />
          <Route path="/admin/employees" component={AdminEmployees} />
          <Route path="/admin/notifications" component={AdminNotifications} />
          <Route path="/admin/reports" component={AdminReports} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
