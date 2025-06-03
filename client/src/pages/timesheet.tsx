import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { 
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Timer,
  Briefcase,
  Coffee
} from "lucide-react";

export default function TimesheetPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Timesheet</h1>
              <p className="text-muted-foreground">
                Track and manage your work hours
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hours This Week</CardTitle>
                  <Clock className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42.5 hrs</div>
                  <div className="flex items-center text-xs text-blue-200">
                    <span>Target: 40 hrs</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
                  <Timer className="h-4 w-4 text-emerald-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.5 hrs</div>
                  <div className="flex items-center text-xs text-emerald-200">
                    <span>This week</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  <AlertCircle className="h-4 w-4 text-amber-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8 hrs</div>
                  <div className="flex items-center text-xs text-amber-200">
                    <span>Last week</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Project Hours</CardTitle>
                  <Briefcase className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">35 hrs</div>
                  <div className="flex items-center text-xs text-purple-200">
                    <span>This week</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Weekly Timesheet */}
              <Card className="col-span-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Weekly Timesheet</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">Mar 11 - Mar 17, 2024</span>
                      <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { day: "Monday", date: "Mar 11", hours: 8.5, status: "Approved", project: "Project Alpha" },
                      { day: "Tuesday", date: "Mar 12", hours: 8.0, status: "Approved", project: "Project Alpha" },
                      { day: "Wednesday", date: "Mar 13", hours: 9.0, status: "Pending", project: "Project Beta" },
                      { day: "Thursday", date: "Mar 14", hours: 8.5, status: "Pending", project: "Project Beta" },
                      { day: "Friday", date: "Mar 15", hours: 8.5, status: "Pending", project: "Project Alpha" },
                    ].map((entry, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{entry.day}</p>
                            <p className="text-xs text-gray-500">{entry.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{entry.hours} hrs</p>
                            <p className="text-xs text-gray-500">{entry.project}</p>
                          </div>
                          <span className={`text-sm font-medium ${
                            entry.status === "Approved" ? "text-emerald-600" : "text-amber-600"
                          }`}>
                            {entry.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="col-span-3 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <Button className="h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Add Time Entry</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Submit Timesheet</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Coffee className="h-5 w-5" />
                        <span>Request Break Time</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>View Reports</span>
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