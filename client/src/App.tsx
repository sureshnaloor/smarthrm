import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Pay from "@/pages/pay";
import Records from "@/pages/records";
import Messages from "@/pages/messages";
import Performance from "@/pages/performance";
import Leave from "@/pages/leave";
import Timesheet from "@/pages/timesheet";
import Documents from "@/pages/documents";
import Team from "@/pages/team";
import Settings from "@/pages/settings";
import UnderConstruction from "@/pages/under-construction";
import AdminEmployees from "@/pages/admin/employees";
import AdminNotifications from "@/pages/admin/notifications";
import AdminReports from "@/pages/admin/reports";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pay" component={Pay} />
      <Route path="/records" component={Records} />
      <Route path="/messages" component={Messages} />
      <Route path="/performance" component={Performance} />
      <Route path="/leave" component={Leave} />
      <Route path="/timesheet" component={Timesheet} />
      <Route path="/documents" component={Documents} />
      <Route path="/team" component={Team} />
      <Route path="/settings" component={Settings} />
      <Route path="/under-construction" component={UnderConstruction} />
      <Route path="/admin/employees" component={AdminEmployees} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/admin/reports" component={AdminReports} />
      
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
