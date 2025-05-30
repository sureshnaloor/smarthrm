import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building, Calendar, FileText, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function Records() {
  const { user } = useAuth();
  
  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents"],
    enabled: !!user?.employee,
  });

  const { data: timeOffRequests } = useQuery({
    queryKey: ["/api/timeoff/requests"],
    enabled: !!user?.employee,
  });

  const employee = user?.employee;

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
            <h1 className="page-header">My Records</h1>
            <p className="page-subtitle">View and manage your employment information</p>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground">{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                    <p className="text-foreground">{employee?.employeeId}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground">{employee?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground">{employee?.address || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={employee?.status === "active" ? "status-active" : "status-inactive"}>
                      {employee?.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Employment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-foreground">{employee?.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Position</label>
                    <p className="text-foreground">{employee?.position}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <p className="text-foreground">
                      {employee?.startDate ? format(new Date(employee.startDate), "MMMM d, yyyy") : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employment Type</label>
                    <p className="text-foreground">Full-time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Off Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Time Off Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!timeOffRequests || timeOffRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No time off requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timeOffRequests.map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground capitalize">{request.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(request.startDate), "MMM d")} - {format(new Date(request.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{request.days} days</p>
                        </div>
                        <Badge 
                          className={
                            request.status === "approved" ? "status-active" :
                            request.status === "pending" ? "status-pending" :
                            "status-inactive"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!documents || documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No documents available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <FileText className="text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.fileName}</p>
                          <p className="text-sm text-muted-foreground capitalize">{doc.documentType}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(doc.createdAt), "MMM d, yyyy")}
                        </p>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
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
