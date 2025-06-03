import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { 
  Calendar, 
  Clock, 
  FileText, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Plane,
  Umbrella,
  Heart,
  Briefcase
} from "lucide-react";

export default function LeavePage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
              <p className="text-muted-foreground">
                Request and track your time off
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Annual Leave Balance</CardTitle>
                  <Plane className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20 days</div>
                  <div className="flex items-center text-xs text-blue-200">
                    <span>Remaining this year</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sick Leave Balance</CardTitle>
                  <Heart className="h-4 w-4 text-emerald-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10 days</div>
                  <div className="flex items-center text-xs text-emerald-200">
                    <span>Remaining this year</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Clock className="h-4 w-4 text-amber-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <div className="flex items-center text-xs text-amber-200">
                    <span>Awaiting approval</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Leave</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5 days</div>
                  <div className="flex items-center text-xs text-purple-200">
                    <span>Next 30 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Recent Leave Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Annual Leave", status: "Approved", date: "Mar 15-20, 2024", icon: Plane },
                      { type: "Sick Leave", status: "Pending", date: "Mar 22-23, 2024", icon: Heart },
                      { type: "Work From Home", status: "Approved", date: "Mar 25, 2024", icon: Briefcase }
                    ].map((leave, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <leave.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{leave.type}</p>
                          <p className="text-xs text-muted-foreground">{leave.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            leave.status === "Approved" ? "text-emerald-600" : "text-amber-600"
                          }`}>
                            {leave.status}
                          </span>
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
                        <Plane className="h-5 w-5" />
                        <span>Request Annual Leave</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5" />
                        <span>Request Sick Leave</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5" />
                        <span>Request Work From Home</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>View Leave Calendar</span>
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