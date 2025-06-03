import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { 
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  FileText,
  Download,
  Calendar,
  Banknote,
  PiggyBank,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  History
} from "lucide-react";

export default function PayPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Pay & Compensation</h1>
              <p className="text-muted-foreground">
                View your salary details and payment history
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,500</div>
                  <div className="flex items-center text-xs text-blue-200">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>5% increase from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Year-to-Date Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$25,500</div>
                  <div className="flex items-center text-xs text-emerald-200">
                    <span>Q1 2024</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tax Withheld</CardTitle>
                  <Percent className="h-4 w-4 text-amber-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,550</div>
                  <div className="flex items-center text-xs text-amber-200">
                    <span>30% of monthly salary</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Mar 31, 2024</div>
                  <div className="flex items-center text-xs text-purple-200">
                    <span>Net: $5,950</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Payment History */}
              <Card className="col-span-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Payment History</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        month: "March 2024",
                        date: "Mar 15, 2024",
                        amount: "$8,500",
                        status: "Paid",
                        type: "Regular Salary",
                        icon: Banknote
                      },
                      { 
                        month: "February 2024",
                        date: "Feb 15, 2024",
                        amount: "$8,100",
                        status: "Paid",
                        type: "Regular Salary",
                        icon: Banknote
                      },
                      { 
                        month: "January 2024",
                        date: "Jan 15, 2024",
                        amount: "$8,100",
                        status: "Paid",
                        type: "Regular Salary",
                        icon: Banknote
                      },
                      { 
                        month: "December 2023",
                        date: "Dec 15, 2023",
                        amount: "$8,100",
                        status: "Paid",
                        type: "Regular Salary",
                        icon: Banknote
                      },
                      { 
                        month: "November 2023",
                        date: "Nov 15, 2023",
                        amount: "$8,100",
                        status: "Paid",
                        type: "Regular Salary",
                        icon: Banknote
                      }
                    ].map((payment, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <payment.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{payment.month}</p>
                            <p className="text-xs text-gray-500">{payment.type} • {payment.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{payment.amount}</p>
                            <p className="text-xs text-gray-500">{payment.status}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Receipt className="h-4 w-4" />
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
                        <Receipt className="h-5 w-5" />
                        <span>View Payslip</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Tax Documents</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <PiggyBank className="h-5 w-5" />
                        <span>Savings & Benefits</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <History className="h-5 w-5" />
                        <span>Payment History</span>
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
