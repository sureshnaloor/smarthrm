import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { 
  FileText,
  Download,
  Upload,
  History,
  Award,
  GraduationCap,
  Briefcase,
  FileCheck,
  FileX,
  FileClock,
  FileSearch,
  FilePlus
} from "lucide-react";

export default function RecordsPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Employee Records</h1>
              <p className="text-muted-foreground">
                Access and manage your employment documents
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <div className="flex items-center text-xs text-blue-200">
                    <span>In your records</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified Documents</CardTitle>
                  <FileCheck className="h-4 w-4 text-emerald-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <div className="flex items-center text-xs text-emerald-200">
                    <span>Approved by HR</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <FileClock className="h-4 w-4 text-amber-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <div className="flex items-center text-xs text-amber-200">
                    <span>Awaiting verification</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <FileX className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <div className="flex items-center text-xs text-purple-200">
                    <span>Within 30 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Documents List */}
              <Card className="col-span-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Documents</CardTitle>
                    <Button variant="outline" size="sm">
                      <FileSearch className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        title: "Employment Contract",
                        type: "Contract",
                        date: "Mar 15, 2024",
                        status: "Verified",
                        icon: FileCheck
                      },
                      { 
                        title: "Tax Declaration Form",
                        type: "Tax",
                        date: "Mar 10, 2024",
                        status: "Pending",
                        icon: FileClock
                      },
                      { 
                        title: "Professional Certification",
                        type: "Certification",
                        date: "Mar 5, 2024",
                        status: "Verified",
                        icon: Award
                      },
                      { 
                        title: "Educational Transcript",
                        type: "Education",
                        date: "Mar 1, 2024",
                        status: "Verified",
                        icon: GraduationCap
                      },
                      { 
                        title: "Work Experience Letter",
                        type: "Experience",
                        date: "Feb 28, 2024",
                        status: "Pending",
                        icon: Briefcase
                      }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <doc.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.title}</p>
                            <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm font-medium ${
                            doc.status === "Verified" ? "text-emerald-600" : "text-amber-600"
                          }`}>
                            {doc.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
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
                        <Upload className="h-5 w-5" />
                        <span>Upload Document</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <FilePlus className="h-5 w-5" />
                        <span>Request New Document</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <History className="h-5 w-5" />
                        <span>View Document History</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>View All Documents</span>
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
