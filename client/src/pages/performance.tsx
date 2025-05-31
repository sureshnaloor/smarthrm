import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Target, TrendingUp, Users, Award, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Performance Reviews</h1>
              <p className="text-muted-foreground">
                Track your performance goals and review progress
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="kpis">My KPIs</TabsTrigger>
                <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                {isAdmin && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Current KPIs</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{myKpis.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Active performance indicators
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">KPI Progress</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Math.round(calculateKpiProgress())}%</div>
                      <Progress value={calculateKpiProgress()} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{myReviews.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Completed performance reviews
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Cycles</CardTitle>
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{activeReviewCycles.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Current review periods
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {activeReviewCycles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Review Cycle</CardTitle>
                      <CardDescription>
                        Current performance review period and deadlines
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeReviewCycles.map((cycle: any) => (
                        <div key={cycle.id} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{cycle.name}</h3>
                              <p className="text-sm text-muted-foreground">{cycle.description}</p>
                            </div>
                            {getStatusBadge(cycle.status)}
                          </div>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <p className="text-sm font-medium">Start Date</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(cycle.startDate), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">End Date</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(cycle.endDate), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Review Deadline</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(cycle.reviewDeadline), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {isAdmin && reviewsToComplete.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        Pending Reviews
                      </CardTitle>
                      <CardDescription>
                        Performance reviews awaiting your input
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {reviewsToComplete.slice(0, 5).map((review: any) => (
                          <div key={review.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium">Employee Review #{review.id}</p>
                              <p className="text-sm text-muted-foreground">
                                Status: {getStatusBadge(review.status)}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="kpis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Key Performance Indicators</CardTitle>
                    <CardDescription>
                      Track your progress on assigned performance goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {myKpis.length === 0 ? (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No KPIs Assigned</h3>
                        <p className="text-muted-foreground">
                          You don't have any KPIs assigned for the current review cycle.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {myKpis.map((kpi: any) => (
                          <div key={kpi.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium">{kpi.name}</h3>
                                <p className="text-sm text-muted-foreground">{kpi.description}</p>
                              </div>
                              {getStatusBadge(kpi.status)}
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{kpi.actualValue || 0} / {kpi.targetValue}</span>
                              </div>
                              <Progress value={(kpi.actualValue || 0) / kpi.targetValue * 100} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Performance Reviews</CardTitle>
                    <CardDescription>
                      View your past and current performance reviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {myReviews.length === 0 ? (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Reviews Found</h3>
                        <p className="text-muted-foreground">
                          You don't have any performance reviews yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {myReviews.map((review: any) => (
                          <div key={review.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium">{review.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(review.createdAt), "MMM dd, yyyy")}
                                </p>
                              </div>
                              {getStatusBadge(review.status)}
                            </div>
                            <div className="mt-4">
                              <p className="text-sm">{review.feedback}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="admin" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Panel</CardTitle>
                      <CardDescription>
                        Manage performance reviews and KPIs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button className="w-full">Create New Review Cycle</Button>
                        <Button className="w-full" variant="outline">Assign KPIs</Button>
                        <Button className="w-full" variant="outline">Generate Reports</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}