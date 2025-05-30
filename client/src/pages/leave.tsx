import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, Clock, CheckCircle, XCircle, AlertCircle, Plane, Coffee } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const leaveRequestSchema = z.object({
  leaveType: z.enum(["casual", "vacation"]),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(1, "Reason is required"),
  isWithPay: z.boolean().default(true),
  emergencyContact: z.string().optional(),
  workCoverage: z.string().optional(),
});

export default function Leave() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch employee data
  const { data: employee } = useQuery({
    queryKey: ["/api/auth/employee"],
    enabled: !!user,
  });

  // Fetch leave balance
  const { data: leaveBalance } = useQuery({
    queryKey: ["/api/employees", employee?.id, "leave-balance"],
    enabled: !!employee?.id,
  });

  // Fetch leave requests
  const { data: leaveRequests = [] } = useQuery({
    queryKey: ["/api/leave-requests/my"],
    enabled: !!employee?.id,
  });

  // Fetch leave accrual history
  const { data: accrualHistory = [] } = useQuery({
    queryKey: ["/api/employees", employee?.id, "leave-accruals"],
    enabled: !!employee?.id,
  });

  const form = useForm({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leaveType: "casual",
      startDate: "",
      endDate: "",
      reason: "",
      isWithPay: true,
      emergencyContact: "",
      workCoverage: "",
    },
  });

  const createLeaveRequest = useMutation({
    mutationFn: (data: any) => apiRequest("/api/leave-requests", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),
    onSuccess: () => {
      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been submitted successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/leave-requests/my"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees", employee?.id, "leave-balance"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave request",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const days = differenceInDays(endDate, startDate) + 1;

    createLeaveRequest.mutate({
      ...data,
      days,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      denied: "destructive",
      cancelled: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getLeaveTypeIcon = (type: string) => {
    return type === "vacation" ? <Plane className="h-4 w-4" /> : <Coffee className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leave Management</h1>
        <p className="text-muted-foreground">
          Manage your leave requests and view your available leave balance
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="request">Request Leave</TabsTrigger>
          <TabsTrigger value="history">Leave History</TabsTrigger>
          <TabsTrigger value="accruals">Accrual History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Casual Leave</CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leaveBalance?.casualLeaveBalance || 0} days
                </div>
                <p className="text-xs text-muted-foreground">
                  Earned 1 day per 20 working days • No approval required
                </p>
                <Progress value={Math.min(parseFloat(leaveBalance?.casualLeaveBalance || "0") * 10, 100)} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vacation Leave</CardTitle>
                <Plane className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leaveBalance?.vacationLeaveBalance || 0} days
                </div>
                <p className="text-xs text-muted-foreground">
                  5 days per quarter • Supervisor approval required
                </p>
                <Progress value={Math.min(parseFloat(leaveBalance?.vacationLeaveBalance || "0") * 5, 100)} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leave Policy Summary</CardTitle>
              <CardDescription>
                Understanding your leave entitlements and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Casual Leave
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Earn 1 day every 20 working days</li>
                    <li>• 5 working days per week</li>
                    <li>• No approval required - just inform supervisor</li>
                    <li>• Can be used immediately after accrual</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Vacation Leave
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 20 days per year (5 days per quarter)</li>
                    <li>• Granted after completing each quarter</li>
                    <li>• Supervisor approval required</li>
                    <li>• Can choose vacation pay or time off</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {leaveRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
                <CardDescription>
                  Your latest leave requests and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaveRequests.slice(0, 3).map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {getLeaveTypeIcon(request.leaveType)}
                        <div>
                          <p className="font-medium capitalize">{request.leaveType} Leave</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{request.days} days</span>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit Leave Request</CardTitle>
              <CardDescription>
                Request casual leave (notification) or vacation leave (approval required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="leaveType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casual">Casual Leave (No approval required)</SelectItem>
                            <SelectItem value="vacation">Vacation Leave (Approval required)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Please provide reason for leave..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isWithPay"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>With Pay</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Leave will be deducted from your balance and you'll receive pay
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Emergency contact information" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workCoverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Coverage (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Who will handle your responsibilities while you're away?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={createLeaveRequest.isPending}>
                    {createLeaveRequest.isPending ? "Submitting..." : "Submit Leave Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Request History</CardTitle>
              <CardDescription>
                All your leave requests and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaveRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Leave Requests</h3>
                  <p className="text-muted-foreground">
                    You haven't submitted any leave requests yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((request: any) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getLeaveTypeIcon(request.leaveType)}
                          <div>
                            <h3 className="font-medium capitalize">{request.leaveType} Leave</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(request.startDate), "MMM dd, yyyy")} - {format(new Date(request.endDate), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(request.status)}
                          <p className="text-sm text-muted-foreground mt-1">{request.days} days</p>
                        </div>
                      </div>
                      
                      {request.reason && (
                        <div className="mt-2">
                          <p className="text-sm"><strong>Reason:</strong> {request.reason}</p>
                        </div>
                      )}
                      
                      {request.approverComments && (
                        <div className="mt-2 p-2 bg-muted rounded">
                          <p className="text-sm"><strong>Supervisor Comments:</strong> {request.approverComments}</p>
                        </div>
                      )}

                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>Requested: {format(new Date(request.requestDate || request.createdAt), "MMM dd, yyyy")}</span>
                        {request.responseDate && (
                          <span className="ml-4">
                            Responded: {format(new Date(request.responseDate), "MMM dd, yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accruals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Accrual History</CardTitle>
              <CardDescription>
                Track how your leave balance has grown over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accrualHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Accrual History</h3>
                  <p className="text-muted-foreground">
                    Your leave accrual history will appear here as you earn leave days.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {accrualHistory.map((accrual: any) => (
                    <div key={accrual.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        {accrual.accrualType === "vacation" ? <Plane className="h-4 w-4" /> : <Coffee className="h-4 w-4" />}
                        <div>
                          <p className="font-medium capitalize">{accrual.accrualType} Leave Accrual</p>
                          <p className="text-sm text-muted-foreground">{accrual.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">+{accrual.accrualAmount} days</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(accrual.accrualDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}