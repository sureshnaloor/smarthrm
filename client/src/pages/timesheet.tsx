import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Upload, Calendar, DollarSign, Clock, FileText, Calculator } from "lucide-react";
import { format } from "date-fns";

export default function TimesheetPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), "yyyy-MM"));

  // Fetch timesheet entries
  const { data: timesheetEntries, isLoading: timesheetLoading } = useQuery({
    queryKey: ["/api/timesheet/entries"],
    enabled: !!user,
  });

  // Fetch payroll calculations
  const { data: payrollCalculations, isLoading: payrollLoading } = useQuery({
    queryKey: ["/api/payroll/calculations"],
    enabled: !!user,
  });

  // Fetch current payroll component
  const { data: currentPayrollComponent, isLoading: componentLoading } = useQuery({
    queryKey: ["/api/payroll/components/current"],
    enabled: !!user,
  });

  // Fetch cost centers
  const { data: costCenters, isLoading: costCentersLoading } = useQuery({
    queryKey: ["/api/cost-centers"],
    enabled: !!user,
  });

  // CSV upload mutation
  const csvUploadMutation = useMutation({
    mutationFn: async (data: { csvData: any[], fileName: string }) => {
      return apiRequest("/api/csv-uploads/timesheet", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: (data) => {
      toast({
        title: "CSV Upload Successful",
        description: `Processed ${data.processed} records with ${data.errors.length} errors`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timesheet/entries"] });
      setSelectedFile(null);
      setCsvData([]);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Payroll calculation mutation
  const calculatePayrollMutation = useMutation({
    mutationFn: async (period: string) => {
      return apiRequest(`/api/payroll/calculate/${period}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Payroll Calculated",
        description: "Payroll has been calculated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/calculations"] });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });
      
      setCsvData(data);
    };
    reader.readAsText(file);
  };

  const handleCsvUpload = () => {
    if (!selectedFile || csvData.length === 0) {
      toast({
        title: "No Data",
        description: "Please select a CSV file with valid data",
        variant: "destructive",
      });
      return;
    }

    csvUploadMutation.mutate({
      csvData,
      fileName: selectedFile.name,
    });
  };

  const handleCalculatePayroll = () => {
    calculatePayrollMutation.mutate(selectedPeriod);
  };

  if (!user) {
    return <div>Please log in to access timesheet management.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timesheet & Payroll</h1>
        <p className="text-muted-foreground">
          Manage attendance records, upload timesheet data, and process payroll calculations.
        </p>
      </div>

      <Tabs defaultValue="timesheet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="upload">CSV Upload</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="components">Pay Components</TabsTrigger>
        </TabsList>

        <TabsContent value="timesheet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                My Timesheet Entries
              </CardTitle>
              <CardDescription>
                View your attendance records and working hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timesheetLoading ? (
                <div>Loading timesheet entries...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Hours Worked</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timesheetEntries?.slice(0, 10).map((entry: any) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.workDate}</TableCell>
                        <TableCell>{entry.hoursWorked}</TableCell>
                        <TableCell>{entry.overtimeHours || '0'}</TableCell>
                        <TableCell>{entry.checkInTime || '-'}</TableCell>
                        <TableCell>{entry.checkOutTime || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={entry.isManualEntry ? "secondary" : "default"}>
                            {entry.isManualEntry ? "Manual" : "System"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Timesheet Data
              </CardTitle>
              <CardDescription>
                Upload attendance data from external systems via CSV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                <p className="text-sm text-muted-foreground">
                  Required columns: employeeId, workDate, hoursWorked, costCenterCode
                  <br />
                  Optional columns: overtimeHours, breakHours, checkInTime, checkOutTime, remarks
                </p>
              </div>

              {csvData.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Preview ({csvData.length} records)</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(csvData[0] || {}).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.slice(0, 5).map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value: any, i) => (
                              <TableCell key={i}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {csvData.length > 5 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing first 5 of {csvData.length} records
                      </p>
                    )}
                  </div>

                  <Button 
                    onClick={handleCsvUpload}
                    disabled={csvUploadMutation.isPending}
                    className="w-full"
                  >
                    {csvUploadMutation.isPending ? "Processing..." : "Upload Timesheet Data"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculate Payroll
                </CardTitle>
                <CardDescription>
                  Generate payroll calculations based on timesheet and leave data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Payroll Period</Label>
                  <Input
                    id="period"
                    type="month"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCalculatePayroll}
                  disabled={calculatePayrollMutation.isPending}
                  className="w-full"
                >
                  {calculatePayrollMutation.isPending ? "Calculating..." : "Calculate Payroll"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Recent Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payrollLoading ? (
                  <div>Loading payroll data...</div>
                ) : (
                  <div className="space-y-3">
                    {payrollCalculations?.slice(0, 5).map((calc: any) => (
                      <div key={calc.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{calc.payrollPeriod}</p>
                          <p className="text-sm text-muted-foreground">
                            {calc.totalDaysWorked} days worked
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${parseFloat(calc.netSalary).toFixed(2)}</p>
                          <Badge variant={calc.status === 'approved' ? 'default' : 'secondary'}>
                            {calc.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Days Worked</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollCalculations?.map((calc: any) => (
                    <TableRow key={calc.id}>
                      <TableCell>{calc.payrollPeriod}</TableCell>
                      <TableCell>{calc.totalDaysWorked}</TableCell>
                      <TableCell>${parseFloat(calc.basicSalary).toFixed(2)}</TableCell>
                      <TableCell>
                        ${(
                          parseFloat(calc.transportAllowance) +
                          parseFloat(calc.foodAllowance) +
                          parseFloat(calc.accommodationAllowance)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>${parseFloat(calc.grossSalary).toFixed(2)}</TableCell>
                      <TableCell className="font-bold">${parseFloat(calc.netSalary).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={calc.status === 'approved' ? 'default' : 'secondary'}>
                          {calc.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Current Pay Components
              </CardTitle>
              <CardDescription>
                Your current salary structure and allowances
              </CardDescription>
            </CardHeader>
            <CardContent>
              {componentLoading ? (
                <div>Loading pay components...</div>
              ) : currentPayrollComponent ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Salary (per day):</span>
                      <span className="font-bold">${parseFloat(currentPayrollComponent.basicSalaryPerDay).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transport Allowance (per day):</span>
                      <span className="font-bold">${parseFloat(currentPayrollComponent.transportAllowancePerDay).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Food Allowance (per day):</span>
                      <span className="font-bold">${parseFloat(currentPayrollComponent.foodAllowancePerDay).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accommodation Allowance (per day):</span>
                      <span className="font-bold">${parseFloat(currentPayrollComponent.accommodationAllowancePerDay).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Effective From:</span>
                      <span>{currentPayrollComponent.effectiveFrom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={currentPayrollComponent.isActive ? 'default' : 'secondary'}>
                        {currentPayrollComponent.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Total Daily Rate:</p>
                      <p className="text-2xl font-bold">
                        ${(
                          parseFloat(currentPayrollComponent.basicSalaryPerDay) +
                          parseFloat(currentPayrollComponent.transportAllowancePerDay) +
                          parseFloat(currentPayrollComponent.foodAllowancePerDay) +
                          parseFloat(currentPayrollComponent.accommodationAllowancePerDay)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No pay components found. Contact HR to set up your salary structure.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}