import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Target, TrendingUp, Users, Award, AlertCircle, Star, ArrowUpRight, ArrowDownRight, CheckCircle2, Calendar, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export default function Performance() {
  const { user } = useAuth();

  // Fetch employee data to check if admin
  const { data: employee } = useQuery({
    queryKey: ["/api/auth/employee"],
    enabled: !!user,
  });

  // Fetch KPI definitions
  const { data: kpiDefinitions = [] } = useQuery({
    queryKey: ["/api/kpi-definitions"],
    enabled: !!user,
  });

  // Fetch review cycles
  const { data: reviewCycles = [] } = useQuery({
    queryKey: ["/api/review-cycles"],
    enabled: !!user,
  });

  // Fetch active review cycles
  const { data: activeReviewCycles = [] } = useQuery({
    queryKey: ["/api/review-cycles", "active"],
    queryFn: () => fetch("/api/review-cycles?active=true").then(res => res.json()),
    enabled: !!user,
  });

  // Fetch employee's performance reviews
  const { data: myReviews = [] } = useQuery({
    queryKey: ["/api/employees", employee?.id, "performance-reviews"],
    enabled: !!employee?.id,
  });

  // Fetch reviews for admin (if admin)
  const { data: reviewsToComplete = [] } = useQuery({
    queryKey: ["/api/performance-reviews/reviewer"],
    enabled: !!employee?.isAdmin,
  });

  // Get latest KPIs for active cycle
  const { data: myKpis = [] } = useQuery({
    queryKey: ["/api/employees", employee?.id, "kpis"],
    queryFn: () => {
      if (!employee?.id || activeReviewCycles.length === 0) return [];
      const activeoCycle = activeReviewCycles[0];
      return fetch(`/api/employees/${employee.id}/kpis?reviewCycleId=${activeoCycle.id}`)
        .then(res => res.json());
    },
    enabled: !!employee?.id && activeReviewCycles.length > 0,
  });

  const isAdmin = employee?.isAdmin;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      submitted: "secondary",
      reviewed: "default",
      approved: "default",
      completed: "default",
      active: "default",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const calculateKpiProgress = () => {
    if (myKpis.length === 0) return 0;
    const completedKpis = myKpis.filter((kpi: any) => kpi.actualValue !== null);
    return (completedKpis.length / myKpis.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Performance Reviews</h1>
              <p className="text-muted-foreground">
                Track and manage employee performance metrics and reviews
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
                  <Star className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2/5.0</div>
                  <div className="flex items-center text-xs text-blue-200">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>0.3 from last quarter</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
                  <Target className="h-4 w-4 text-emerald-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <div className="flex items-center text-xs text-emerald-200">
                    <span>12 out of 14 goals completed</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Peer Reviews</CardTitle>
                  <Users className="h-4 w-4 text-amber-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.5/5.0</div>
                  <div className="flex items-center text-xs text-amber-200">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>0.2 from last review</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Review</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15 Days</div>
                  <div className="flex items-center text-xs text-purple-200">
                    <span>Q2 2024 Review</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Award className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Q1 2024 Performance Review</p>
                          <p className="text-xs text-muted-foreground">Completed on March 15, 2024</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-emerald-600">4.2/5.0</span>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <Button className="h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>Set New Goals</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>View Performance Metrics</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Request Peer Review</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>View Career Progress</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}