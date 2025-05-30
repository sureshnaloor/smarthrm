import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Pay() {
  const { user } = useAuth();
  
  const { data: payRecords, isLoading } = useQuery({
    queryKey: ["/api/pay/records"],
    enabled: !!user?.employee,
  });

  const { data: latestPay } = useQuery({
    queryKey: ["/api/pay/latest"],
    enabled: !!user?.employee,
  });

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
            <h1 className="page-header">Pay & Benefits</h1>
            <p className="page-subtitle">View your salary information and pay history</p>
          </div>

          {/* Current Pay Summary */}
          {latestPay && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Latest Net Pay</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${Number(latestPay.netPay).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-accent text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pay Period</p>
                      <p className="text-lg font-semibold text-foreground">
                        {format(new Date(latestPay.payPeriodStart), "MMM d")} - {format(new Date(latestPay.payPeriodEnd), "MMM d")}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="text-primary text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Annual Salary</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${Number(user?.employee?.salary || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <FileText className="text-secondary text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pay History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pay History</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!payRecords || payRecords.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pay records found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payRecords.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <FileText className="text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {format(new Date(record.payPeriodStart), "MMMM yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pay Period: {format(new Date(record.payPeriodStart), "MMM d")} - {format(new Date(record.payPeriodEnd), "MMM d")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-foreground">${Number(record.netPay).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Net Pay</p>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {record.payType}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Health Insurance</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">Plan: Premium Health Plan</p>
                    <p className="text-muted-foreground">Coverage: Employee + Family</p>
                    <p className="text-muted-foreground">Monthly Premium: $250</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Retirement</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">401(k) Contribution: 5%</p>
                    <p className="text-muted-foreground">Company Match: 3%</p>
                    <p className="text-muted-foreground">Vesting: 100% after 3 years</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
