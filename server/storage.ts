import {
  users,
  employees,
  payRecords,
  timeOffRequests,
  notifications,
  employeeDocuments,
  leaveBalances,
  leaveAccruals,
  costCenters,
  timesheetEntries,
  payrollComponents,
  payrollCalculations,
  csvUploads,
  kpiDefinitions,
  reviewCycles,
  employeeKpis,
  performanceReviews,
  performanceImprovementPlans,
  type User,
  type UpsertUser,
  type Employee,
  type InsertEmployee,
  type PayRecord,
  type InsertPayRecord,
  type TimeOffRequest,
  type InsertTimeOffRequest,
  type Notification,
  type InsertNotification,
  type EmployeeDocument,
  type InsertEmployeeDocument,
  type LeaveBalance,
  type InsertLeaveBalance,
  type LeaveAccrual,
  type InsertLeaveAccrual,
  type CostCenter,
  type InsertCostCenter,
  type TimesheetEntry,
  type InsertTimesheetEntry,
  type PayrollComponent,
  type InsertPayrollComponent,
  type PayrollCalculation,
  type InsertPayrollCalculation,
  type CsvUpload,
  type InsertCsvUpload,
  type KpiDefinition,
  type InsertKpiDefinition,
  type ReviewCycle,
  type InsertReviewCycle,
  type EmployeeKpi,
  type InsertEmployeeKpi,
  type PerformanceReview,
  type InsertPerformanceReview,
  type PerformanceImprovementPlan,
  type InsertPerformanceImprovementPlan,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, isNull, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Employee operations
  getEmployeeByUserId(userId: string): Promise<Employee | undefined>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getAllEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee>;
  getEmployeeWithUser(employeeId: number): Promise<(Employee & { user: User }) | undefined>;
  
  // Pay operations
  getPayRecordsByEmployee(employeeId: number): Promise<PayRecord[]>;
  createPayRecord(payRecord: InsertPayRecord): Promise<PayRecord>;
  getLatestPayRecord(employeeId: number): Promise<PayRecord | undefined>;
  
  // Time off operations
  getTimeOffRequestsByEmployee(employeeId: number): Promise<TimeOffRequest[]>;
  createTimeOffRequest(request: InsertTimeOffRequest): Promise<TimeOffRequest>;
  updateTimeOffRequest(id: number, request: Partial<InsertTimeOffRequest>): Promise<TimeOffRequest>;
  
  // Notification operations
  getNotificationsByEmployee(employeeId: number): Promise<Notification[]>;
  getUnreadNotificationCount(employeeId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
  getCompanyWideNotifications(): Promise<Notification[]>;
  
  // Document operations
  getDocumentsByEmployee(employeeId: number): Promise<EmployeeDocument[]>;
  createDocument(document: InsertEmployeeDocument): Promise<EmployeeDocument>;
  
  // Admin statistics
  getEmployeeCount(): Promise<number>;
  getNewHiresThisMonth(): Promise<number>;
  getPendingTimeOffRequests(): Promise<number>;
  getActiveNotifications(): Promise<number>;
  
  // Performance Review operations
  getAllKpiDefinitions(): Promise<KpiDefinition[]>;
  getKpiDefinitionsByDepartment(department: string): Promise<KpiDefinition[]>;
  createKpiDefinition(kpi: InsertKpiDefinition): Promise<KpiDefinition>;
  updateKpiDefinition(id: number, kpi: Partial<InsertKpiDefinition>): Promise<KpiDefinition>;
  
  getAllReviewCycles(): Promise<ReviewCycle[]>;
  getActiveReviewCycles(): Promise<ReviewCycle[]>;
  createReviewCycle(cycle: InsertReviewCycle): Promise<ReviewCycle>;
  updateReviewCycle(id: number, cycle: Partial<InsertReviewCycle>): Promise<ReviewCycle>;
  
  getEmployeeKpisByReviewCycle(employeeId: number, reviewCycleId: number): Promise<EmployeeKpi[]>;
  assignKpiToEmployee(kpi: InsertEmployeeKpi): Promise<EmployeeKpi>;
  updateEmployeeKpi(id: number, kpi: Partial<InsertEmployeeKpi>): Promise<EmployeeKpi>;
  
  getPerformanceReviewsByEmployee(employeeId: number): Promise<PerformanceReview[]>;
  getPerformanceReviewsByReviewer(reviewerId: number): Promise<PerformanceReview[]>;
  createPerformanceReview(review: InsertPerformanceReview): Promise<PerformanceReview>;
  updatePerformanceReview(id: number, review: Partial<InsertPerformanceReview>): Promise<PerformanceReview>;
  getPerformanceReviewById(id: number): Promise<PerformanceReview | undefined>;
  
  getPerformanceImprovementPlansByEmployee(employeeId: number): Promise<PerformanceImprovementPlan[]>;
  createPerformanceImprovementPlan(plan: InsertPerformanceImprovementPlan): Promise<PerformanceImprovementPlan>;
  updatePerformanceImprovementPlan(id: number, plan: Partial<InsertPerformanceImprovementPlan>): Promise<PerformanceImprovementPlan>;
  
  // Leave Management operations
  getLeaveBalance(employeeId: number, year?: number): Promise<LeaveBalance | undefined>;
  createLeaveBalance(balance: InsertLeaveBalance): Promise<LeaveBalance>;
  updateLeaveBalance(id: number, balance: Partial<InsertLeaveBalance>): Promise<LeaveBalance>;
  
  getLeaveAccrualHistory(employeeId: number): Promise<LeaveAccrual[]>;
  createLeaveAccrual(accrual: InsertLeaveAccrual): Promise<LeaveAccrual>;
  
  calculateCasualLeaveAccrual(employeeId: number): Promise<number>;
  calculateVacationLeaveAccrual(employeeId: number): Promise<number>;
  processLeaveAccruals(employeeId: number): Promise<void>;
  
  deductLeaveBalance(employeeId: number, leaveType: string, days: number): Promise<boolean>;
  validateLeaveRequest(employeeId: number, leaveType: string, days: number): Promise<{valid: boolean, message: string}>;
  
  // Cost Center operations
  getAllCostCenters(): Promise<CostCenter[]>;
  getCostCenter(id: number): Promise<CostCenter | undefined>;
  createCostCenter(costCenter: InsertCostCenter): Promise<CostCenter>;
  updateCostCenter(id: number, costCenter: Partial<InsertCostCenter>): Promise<CostCenter>;
  
  // Timesheet operations
  getTimesheetEntriesByEmployee(employeeId: number, startDate?: string, endDate?: string): Promise<TimesheetEntry[]>;
  getTimesheetEntriesByPeriod(period: string): Promise<TimesheetEntry[]>;
  createTimesheetEntry(entry: InsertTimesheetEntry): Promise<TimesheetEntry>;
  bulkCreateTimesheetEntries(entries: InsertTimesheetEntry[]): Promise<TimesheetEntry[]>;
  updateTimesheetEntry(id: number, entry: Partial<InsertTimesheetEntry>): Promise<TimesheetEntry>;
  deleteTimesheetEntry(id: number): Promise<void>;
  
  // Payroll Component operations
  getPayrollComponentsByEmployee(employeeId: number): Promise<PayrollComponent[]>;
  getCurrentPayrollComponent(employeeId: number): Promise<PayrollComponent | undefined>;
  createPayrollComponent(component: InsertPayrollComponent): Promise<PayrollComponent>;
  updatePayrollComponent(id: number, component: Partial<InsertPayrollComponent>): Promise<PayrollComponent>;
  
  // Payroll Calculation operations
  getPayrollCalculationsByEmployee(employeeId: number): Promise<PayrollCalculation[]>;
  getPayrollCalculationByPeriod(employeeId: number, period: string): Promise<PayrollCalculation | undefined>;
  createPayrollCalculation(calculation: InsertPayrollCalculation): Promise<PayrollCalculation>;
  updatePayrollCalculation(id: number, calculation: Partial<InsertPayrollCalculation>): Promise<PayrollCalculation>;
  calculatePayrollForEmployee(employeeId: number, period: string): Promise<PayrollCalculation>;
  bulkCalculatePayroll(period: string): Promise<PayrollCalculation[]>;
  
  // CSV Upload operations
  getCsvUploads(): Promise<CsvUpload[]>;
  getCsvUpload(batchId: string): Promise<CsvUpload | undefined>;
  createCsvUpload(upload: InsertCsvUpload): Promise<CsvUpload>;
  updateCsvUpload(batchId: string, upload: Partial<InsertCsvUpload>): Promise<CsvUpload>;
  processTimesheetCsv(batchId: string, csvData: any[]): Promise<{processed: number, errors: any[]}>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Employee operations
  async getEmployeeByUserId(userId: string): Promise<Employee | undefined> {
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.userId, userId));
    return employee ? (employee.employees ?? employee) : undefined;
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id));
    return employee;
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await db
      .select()
      .from(employees)
      .orderBy(employees.firstName, employees.lastName);
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const result = await db
      .insert(employees)
      .values(employee)
      .returning() as any[];
    const [newEmployee] = result;
    return newEmployee;
  }

  async updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee> {
    const [updatedEmployee] = await db
      .update(employees)
      .set({ ...employee, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return updatedEmployee;
  }

  async getEmployeeWithUser(employeeId: number): Promise<(Employee & { user: User }) | undefined> {
    const [result] = await db
      .select()
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .where(eq(employees.id, employeeId));
    
    if (!result) return undefined;
    
    return {
      ...result.employees,
      user: result.users,
    };
  }
  
  // Pay operations
  async getPayRecordsByEmployee(employeeId: number): Promise<PayRecord[]> {
    return await db
      .select()
      .from(payRecords)
      .where(eq(payRecords.employeeId, employeeId))
      .orderBy(desc(payRecords.payDate));
  }

  async createPayRecord(payRecord: InsertPayRecord): Promise<PayRecord> {
    const [newPayRecord] = await db
      .insert(payRecords)
      .values(payRecord)
      .returning();
    return newPayRecord;
  }

  async getLatestPayRecord(employeeId: number): Promise<PayRecord | undefined> {
    const [payRecord] = await db
      .select()
      .from(payRecords)
      .where(eq(payRecords.employeeId, employeeId))
      .orderBy(desc(payRecords.payDate))
      .limit(1);
    return payRecord;
  }
  
  // Time off operations
  async getTimeOffRequestsByEmployee(employeeId: number): Promise<TimeOffRequest[]> {
    return await db
      .select()
      .from(timeOffRequests)
      .where(eq(timeOffRequests.employeeId, employeeId))
      .orderBy(desc(timeOffRequests.requestDate));
  }

  async createTimeOffRequest(request: InsertTimeOffRequest): Promise<TimeOffRequest> {
    const [newRequest] = await db
      .insert(timeOffRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateTimeOffRequest(id: number, request: Partial<InsertTimeOffRequest>): Promise<TimeOffRequest> {
    const [updatedRequest] = await db
      .update(timeOffRequests)
      .set(request)
      .where(eq(timeOffRequests.id, id))
      .returning();
    return updatedRequest;
  }
  
  // Notification operations
  async getNotificationsByEmployee(employeeId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(
        and(
          or(
            eq(notifications.recipientId, employeeId),
            isNull(notifications.recipientId)
          ),
          eq(notifications.isActive, true)
        )
      )
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationCount(employeeId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          or(
            eq(notifications.recipientId, employeeId),
            isNull(notifications.recipientId)
          ),
          eq(notifications.isRead, false),
          eq(notifications.isActive, true)
        )
      );
    return result.count;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  async getCompanyWideNotifications(): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(
        and(
          isNull(notifications.recipientId),
          eq(notifications.isActive, true)
        )
      )
      .orderBy(desc(notifications.createdAt));
  }
  
  // Document operations
  async getDocumentsByEmployee(employeeId: number): Promise<EmployeeDocument[]> {
    return await db
      .select()
      .from(employeeDocuments)
      .where(eq(employeeDocuments.employeeId, employeeId))
      .orderBy(desc(employeeDocuments.createdAt));
  }

  async createDocument(document: InsertEmployeeDocument): Promise<EmployeeDocument> {
    const [newDocument] = await db
      .insert(employeeDocuments)
      .values(document)
      .returning();
    return newDocument;
  }
  
  // Admin statistics
  async getEmployeeCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(employees)
      .where(eq(employees.status, "active"));
    return result.count;
  }

  async getNewHiresThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const [result] = await db
      .select({ count: count() })
      .from(employees)
      .where(
        and(
          eq(employees.status, "active"),
          sql`${employees.createdAt} >= ${startOfMonth}`
        )
      );
    return result.count;
  }

  async getPendingTimeOffRequests(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(timeOffRequests)
      .where(eq(timeOffRequests.status, "pending"));
    return result.count;
  }

  async getActiveNotifications(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(eq(notifications.isActive, true));
    return result.count;
  }
  
  // Performance Review operations
  async getAllKpiDefinitions(): Promise<KpiDefinition[]> {
    return await db
      .select()
      .from(kpiDefinitions)
      .where(eq(kpiDefinitions.isActive, true))
      .orderBy(kpiDefinitions.category, kpiDefinitions.name);
  }

  async getKpiDefinitionsByDepartment(department: string): Promise<KpiDefinition[]> {
    return await db
      .select()
      .from(kpiDefinitions)
      .where(
        and(
          eq(kpiDefinitions.isActive, true),
          or(
            eq(kpiDefinitions.department, department),
            isNull(kpiDefinitions.department)
          )
        )
      )
      .orderBy(kpiDefinitions.category, kpiDefinitions.name);
  }

  async createKpiDefinition(kpi: InsertKpiDefinition): Promise<KpiDefinition> {
    const [newKpi] = await db
      .insert(kpiDefinitions)
      .values(kpi)
      .returning();
    return newKpi;
  }

  async updateKpiDefinition(id: number, kpi: Partial<InsertKpiDefinition>): Promise<KpiDefinition> {
    const [updatedKpi] = await db
      .update(kpiDefinitions)
      .set({ ...kpi, updatedAt: new Date() })
      .where(eq(kpiDefinitions.id, id))
      .returning();
    return updatedKpi;
  }

  async getAllReviewCycles(): Promise<ReviewCycle[]> {
    return await db
      .select()
      .from(reviewCycles)
      .orderBy(desc(reviewCycles.createdAt));
  }

  async getActiveReviewCycles(): Promise<ReviewCycle[]> {
    return await db
      .select()
      .from(reviewCycles)
      .where(eq(reviewCycles.status, "active"))
      .orderBy(desc(reviewCycles.startDate));
  }

  async createReviewCycle(cycle: InsertReviewCycle): Promise<ReviewCycle> {
    const [newCycle] = await db
      .insert(reviewCycles)
      .values(cycle)
      .returning();
    return newCycle;
  }

  async updateReviewCycle(id: number, cycle: Partial<InsertReviewCycle>): Promise<ReviewCycle> {
    const [updatedCycle] = await db
      .update(reviewCycles)
      .set(cycle)
      .where(eq(reviewCycles.id, id))
      .returning();
    return updatedCycle;
  }

  async getEmployeeKpisByReviewCycle(employeeId: number, reviewCycleId: number): Promise<EmployeeKpi[]> {
    return await db
      .select()
      .from(employeeKpis)
      .where(
        and(
          eq(employeeKpis.employeeId, employeeId),
          eq(employeeKpis.reviewCycleId, reviewCycleId)
        )
      )
      .orderBy(employeeKpis.assignedAt);
  }

  async assignKpiToEmployee(kpi: InsertEmployeeKpi): Promise<EmployeeKpi> {
    const [newKpi] = await db
      .insert(employeeKpis)
      .values(kpi)
      .returning();
    return newKpi;
  }

  async updateEmployeeKpi(id: number, kpi: Partial<InsertEmployeeKpi>): Promise<EmployeeKpi> {
    const [updatedKpi] = await db
      .update(employeeKpis)
      .set({ ...kpi, updatedAt: new Date() })
      .where(eq(employeeKpis.id, id))
      .returning();
    return updatedKpi;
  }

  async getPerformanceReviewsByEmployee(employeeId: number): Promise<PerformanceReview[]> {
    return await db
      .select()
      .from(performanceReviews)
      .where(eq(performanceReviews.employeeId, employeeId))
      .orderBy(desc(performanceReviews.createdAt));
  }

  async getPerformanceReviewsByReviewer(reviewerId: number): Promise<PerformanceReview[]> {
    return await db
      .select()
      .from(performanceReviews)
      .where(
        or(
          eq(performanceReviews.reviewerId, reviewerId),
          eq(performanceReviews.secondLevelReviewerId, reviewerId)
        )
      )
      .orderBy(desc(performanceReviews.createdAt));
  }

  async createPerformanceReview(review: InsertPerformanceReview): Promise<PerformanceReview> {
    const [newReview] = await db
      .insert(performanceReviews)
      .values(review)
      .returning();
    return newReview;
  }

  async updatePerformanceReview(id: number, review: Partial<InsertPerformanceReview>): Promise<PerformanceReview> {
    const [updatedReview] = await db
      .update(performanceReviews)
      .set({ ...review, updatedAt: new Date() })
      .where(eq(performanceReviews.id, id))
      .returning();
    return updatedReview;
  }

  async getPerformanceReviewById(id: number): Promise<PerformanceReview | undefined> {
    const [review] = await db
      .select()
      .from(performanceReviews)
      .where(eq(performanceReviews.id, id));
    return review;
  }

  async getPerformanceImprovementPlansByEmployee(employeeId: number): Promise<PerformanceImprovementPlan[]> {
    return await db
      .select()
      .from(performanceImprovementPlans)
      .where(eq(performanceImprovementPlans.employeeId, employeeId))
      .orderBy(desc(performanceImprovementPlans.createdAt));
  }

  async createPerformanceImprovementPlan(plan: InsertPerformanceImprovementPlan): Promise<PerformanceImprovementPlan> {
    const [newPlan] = await db
      .insert(performanceImprovementPlans)
      .values(plan)
      .returning();
    return newPlan;
  }

  async updatePerformanceImprovementPlan(id: number, plan: Partial<InsertPerformanceImprovementPlan>): Promise<PerformanceImprovementPlan> {
    const [updatedPlan] = await db
      .update(performanceImprovementPlans)
      .set({ ...plan, updatedAt: new Date() })
      .where(eq(performanceImprovementPlans.id, id))
      .returning();
    return updatedPlan;
  }

  // Leave Management operations
  async getLeaveBalance(employeeId: number, year?: number): Promise<LeaveBalance | undefined> {
    const currentYear = year || new Date().getFullYear();
    const [balance] = await db
      .select()
      .from(leaveBalances)
      .where(
        and(
          eq(leaveBalances.employeeId, employeeId),
          eq(leaveBalances.year, currentYear)
        )
      );
    return balance;
  }

  async createLeaveBalance(balance: InsertLeaveBalance): Promise<LeaveBalance> {
    const [newBalance] = await db
      .insert(leaveBalances)
      .values(balance)
      .returning();
    return newBalance;
  }

  async updateLeaveBalance(id: number, balance: Partial<InsertLeaveBalance>): Promise<LeaveBalance> {
    const [updatedBalance] = await db
      .update(leaveBalances)
      .set({ ...balance, updatedAt: new Date() })
      .where(eq(leaveBalances.id, id))
      .returning();
    return updatedBalance;
  }

  async getLeaveAccrualHistory(employeeId: number): Promise<LeaveAccrual[]> {
    return await db
      .select()
      .from(leaveAccruals)
      .where(eq(leaveAccruals.employeeId, employeeId))
      .orderBy(desc(leaveAccruals.accrualDate));
  }

  async createLeaveAccrual(accrual: InsertLeaveAccrual): Promise<LeaveAccrual> {
    const [newAccrual] = await db
      .insert(leaveAccruals)
      .values(accrual)
      .returning();
    return newAccrual;
  }

  // Calculate casual leave accrual: 1 day every 20 working days
  async calculateCasualLeaveAccrual(employeeId: number): Promise<number> {
    const employee = await this.getEmployee(employeeId);
    if (!employee) return 0;

    const startDate = new Date(employee.startDate);
    const currentDate = new Date();
    
    // Calculate working days since start (5 working days per week)
    const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeksSinceStart = Math.floor(daysSinceStart / 7);
    const workingDaysSinceStart = weeksSinceStart * 5;
    
    // 1 day accrual for every 20 working days
    return Math.floor(workingDaysSinceStart / 20);
  }

  // Calculate vacation leave accrual: 5 days per quarter after completing each quarter
  async calculateVacationLeaveAccrual(employeeId: number): Promise<number> {
    const employee = await this.getEmployee(employeeId);
    if (!employee) return 0;

    const startDate = new Date(employee.startDate);
    const currentDate = new Date();
    
    // Calculate completed quarters of service
    const monthsSinceStart = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                            (currentDate.getMonth() - startDate.getMonth());
    const completedQuarters = Math.floor(monthsSinceStart / 3);
    
    // 5 days for each completed quarter
    return completedQuarters * 5;
  }

  // Process leave accruals for an employee
  async processLeaveAccruals(employeeId: number): Promise<void> {
    const currentYear = new Date().getFullYear();
    
    // Get or create leave balance for current year
    let balance = await this.getLeaveBalance(employeeId, currentYear);
    if (!balance) {
      balance = await this.createLeaveBalance({
        employeeId,
        casualLeaveBalance: "0",
        vacationLeaveBalance: "0",
        year: currentYear,
      });
    }

    // Calculate accruals
    const casualAccrual = await this.calculateCasualLeaveAccrual(employeeId);
    const vacationAccrual = await this.calculateVacationLeaveAccrual(employeeId);

    // Update balances if there are new accruals
    const currentCasual = parseFloat(balance.casualLeaveBalance);
    const currentVacation = parseFloat(balance.vacationLeaveBalance);

    if (casualAccrual > currentCasual) {
      const newCasualDays = casualAccrual - currentCasual;
      await this.updateLeaveBalance(balance.id, {
        casualLeaveBalance: casualAccrual.toString(),
      });
      
      // Record accrual history
      await this.createLeaveAccrual({
        employeeId,
        accrualType: "casual",
        accrualAmount: newCasualDays.toString(),
        accrualDate: new Date().toISOString().split('T')[0],
        reason: `Accrued ${newCasualDays} casual leave days (1 day per 20 working days)`,
      });
    }

    if (vacationAccrual > currentVacation) {
      const newVacationDays = vacationAccrual - currentVacation;
      await this.updateLeaveBalance(balance.id, {
        vacationLeaveBalance: vacationAccrual.toString(),
      });

      // Record accrual history
      await this.createLeaveAccrual({
        employeeId,
        accrualType: "vacation",
        accrualAmount: newVacationDays.toString(),
        accrualDate: new Date().toISOString().split('T')[0],
        reason: `Accrued ${newVacationDays} vacation leave days (5 days per completed quarter)`,
      });
    }
  }

  // Deduct leave balance when leave is taken
  async deductLeaveBalance(employeeId: number, leaveType: string, days: number): Promise<boolean> {
    const balance = await this.getLeaveBalance(employeeId);
    if (!balance) return false;

    const currentBalance = parseFloat(
      leaveType === "casual" ? balance.casualLeaveBalance : balance.vacationLeaveBalance
    );

    if (currentBalance < days) return false;

    const newBalance = currentBalance - days;
    const updateField = leaveType === "casual" ? 
      { casualLeaveBalance: newBalance.toString() } : 
      { vacationLeaveBalance: newBalance.toString() };

    await this.updateLeaveBalance(balance.id, updateField);
    return true;
  }

  // Validate leave request against balance and policies
  async validateLeaveRequest(employeeId: number, leaveType: string, days: number): Promise<{valid: boolean, message: string}> {
    // Process latest accruals first
    await this.processLeaveAccruals(employeeId);
    
    const balance = await this.getLeaveBalance(employeeId);
    if (!balance) {
      return { valid: false, message: "Leave balance not found" };
    }

    const availableBalance = parseFloat(
      leaveType === "casual" ? balance.casualLeaveBalance : balance.vacationLeaveBalance
    );

    if (availableBalance < days) {
      return { 
        valid: false, 
        message: `Insufficient ${leaveType} leave balance. Available: ${availableBalance} days, Requested: ${days} days` 
      };
    }

    return { valid: true, message: "Leave request is valid" };
  }

  // Cost Center operations
  async getAllCostCenters(): Promise<CostCenter[]> {
    return await db.select().from(costCenters).where(eq(costCenters.isActive, true));
  }

  async getCostCenter(id: number): Promise<CostCenter | undefined> {
    const [costCenter] = await db.select().from(costCenters).where(eq(costCenters.id, id));
    return costCenter;
  }

  async createCostCenter(costCenter: InsertCostCenter): Promise<CostCenter> {
    const [created] = await db.insert(costCenters).values(costCenter).returning();
    return created;
  }

  async updateCostCenter(id: number, costCenter: Partial<InsertCostCenter>): Promise<CostCenter> {
    const [updated] = await db
      .update(costCenters)
      .set(costCenter)
      .where(eq(costCenters.id, id))
      .returning();
    return updated;
  }

  // Timesheet operations
  async getTimesheetEntriesByEmployee(employeeId: number, startDate?: string, endDate?: string): Promise<TimesheetEntry[]> {
    let whereClause;
    if (startDate && endDate) {
      whereClause = and(
        eq(timesheetEntries.employeeId, employeeId),
        sql`${timesheetEntries.workDate} >= ${startDate}`,
        sql`${timesheetEntries.workDate} <= ${endDate}`
      );
    } else {
      whereClause = eq(timesheetEntries.employeeId, employeeId);
    }

    return await db
      .select()
      .from(timesheetEntries)
      .where(whereClause)
      .orderBy(desc(timesheetEntries.workDate));
  }

  async getTimesheetEntriesByPeriod(period: string): Promise<TimesheetEntry[]> {
    const [year, month] = period.split('-');
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;
    
    return await db.select()
      .from(timesheetEntries)
      .where(
        and(
          sql`${timesheetEntries.workDate} >= ${startDate}`,
          sql`${timesheetEntries.workDate} <= ${endDate}`
        )
      )
      .orderBy(timesheetEntries.employeeId, timesheetEntries.workDate);
  }

  async createTimesheetEntry(entry: InsertTimesheetEntry): Promise<TimesheetEntry> {
    const [created] = await db.insert(timesheetEntries).values(entry).returning();
    return created;
  }

  async bulkCreateTimesheetEntries(entries: InsertTimesheetEntry[]): Promise<TimesheetEntry[]> {
    if (entries.length === 0) return [];
    return await db.insert(timesheetEntries).values(entries).returning();
  }

  async updateTimesheetEntry(id: number, entry: Partial<InsertTimesheetEntry>): Promise<TimesheetEntry> {
    const [updated] = await db
      .update(timesheetEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(timesheetEntries.id, id))
      .returning();
    return updated;
  }

  async deleteTimesheetEntry(id: number): Promise<void> {
    await db.delete(timesheetEntries).where(eq(timesheetEntries.id, id));
  }

  // Payroll Component operations
  async getPayrollComponentsByEmployee(employeeId: number): Promise<PayrollComponent[]> {
    return await db.select()
      .from(payrollComponents)
      .where(eq(payrollComponents.employeeId, employeeId))
      .orderBy(desc(payrollComponents.effectiveFrom));
  }

  async getCurrentPayrollComponent(employeeId: number): Promise<PayrollComponent | undefined> {
    const [component] = await db.select()
      .from(payrollComponents)
      .where(
        and(
          eq(payrollComponents.employeeId, employeeId),
          eq(payrollComponents.isActive, true),
          or(
            isNull(payrollComponents.effectiveTo),
            sql`${payrollComponents.effectiveTo} >= CURRENT_DATE`
          )
        )
      )
      .orderBy(desc(payrollComponents.effectiveFrom))
      .limit(1);
    return component;
  }

  async createPayrollComponent(component: InsertPayrollComponent): Promise<PayrollComponent> {
    const [created] = await db.insert(payrollComponents).values(component).returning();
    return created;
  }

  async updatePayrollComponent(id: number, component: Partial<InsertPayrollComponent>): Promise<PayrollComponent> {
    const [updated] = await db
      .update(payrollComponents)
      .set({ ...component, updatedAt: new Date() })
      .where(eq(payrollComponents.id, id))
      .returning();
    return updated;
  }

  // Payroll Calculation operations
  async getPayrollCalculationsByEmployee(employeeId: number): Promise<PayrollCalculation[]> {
    return await db.select()
      .from(payrollCalculations)
      .where(eq(payrollCalculations.employeeId, employeeId))
      .orderBy(desc(payrollCalculations.payrollPeriod));
  }

  async getPayrollCalculationByPeriod(employeeId: number, period: string): Promise<PayrollCalculation | undefined> {
    const [calculation] = await db.select()
      .from(payrollCalculations)
      .where(
        and(
          eq(payrollCalculations.employeeId, employeeId),
          eq(payrollCalculations.payrollPeriod, period)
        )
      );
    return calculation;
  }

  async createPayrollCalculation(calculation: InsertPayrollCalculation): Promise<PayrollCalculation> {
    const [created] = await db.insert(payrollCalculations).values(calculation).returning();
    return created;
  }

  async updatePayrollCalculation(id: number, calculation: Partial<InsertPayrollCalculation>): Promise<PayrollCalculation> {
    const [updated] = await db
      .update(payrollCalculations)
      .set({ ...calculation, updatedAt: new Date() })
      .where(eq(payrollCalculations.id, id))
      .returning();
    return updated;
  }

  async calculatePayrollForEmployee(employeeId: number, period: string): Promise<PayrollCalculation> {
    const payrollComponent = await this.getCurrentPayrollComponent(employeeId);
    if (!payrollComponent) {
      throw new Error(`No payroll components found for employee ${employeeId}`);
    }

    const [year, month] = period.split('-');
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];

    const timesheetEntries = await this.getTimesheetEntriesByEmployee(employeeId, startDate, endDate);
    
    const leaveRequests = await this.getTimeOffRequestsByEmployee(employeeId);
    const approvedLeave = leaveRequests.filter(req => 
      req.status === 'approved' && 
      req.startDate >= startDate && 
      req.endDate <= endDate
    );
    
    const leaveDaysTaken = approvedLeave.reduce((total, leave) => total + leave.days, 0);

    const totalDaysWorked = timesheetEntries.length;
    const totalHoursWorked = timesheetEntries.reduce((total, entry) => 
      total + parseFloat(entry.hoursWorked), 0
    );
    const overtimeHours = timesheetEntries.reduce((total, entry) => 
      total + parseFloat(entry.overtimeHours || '0'), 0
    );

    const basicSalary = totalDaysWorked * parseFloat(payrollComponent.basicSalaryPerDay);
    const transportAllowance = totalDaysWorked * parseFloat(payrollComponent.transportAllowancePerDay);
    const foodAllowance = totalDaysWorked * parseFloat(payrollComponent.foodAllowancePerDay);
    const accommodationAllowance = totalDaysWorked * parseFloat(payrollComponent.accommodationAllowancePerDay);
    const overtimePay = overtimeHours * (parseFloat(payrollComponent.basicSalaryPerDay) / 8 * 1.5);

    const grossSalary = basicSalary + transportAllowance + foodAllowance + accommodationAllowance + overtimePay;
    const deductions = 0;
    const netSalary = grossSalary - deductions;

    const calculationData: InsertPayrollCalculation = {
      employeeId,
      payrollPeriod: period,
      totalDaysWorked: totalDaysWorked.toString(),
      totalHoursWorked: totalHoursWorked.toString(),
      overtimeHours: overtimeHours.toString(),
      leaveDaysTaken: leaveDaysTaken.toString(),
      basicSalary: basicSalary.toString(),
      transportAllowance: transportAllowance.toString(),
      foodAllowance: foodAllowance.toString(),
      accommodationAllowance: accommodationAllowance.toString(),
      overtimePay: overtimePay.toString(),
      grossSalary: grossSalary.toString(),
      deductions: deductions.toString(),
      netSalary: netSalary.toString(),
      status: 'draft'
    };

    return await this.createPayrollCalculation(calculationData);
  }

  async bulkCalculatePayroll(period: string): Promise<PayrollCalculation[]> {
    const employees = await this.getAllEmployees();
    const calculations: PayrollCalculation[] = [];

    for (const employee of employees) {
      try {
        const existing = await this.getPayrollCalculationByPeriod(employee.id, period);
        if (!existing) {
          const calculation = await this.calculatePayrollForEmployee(employee.id, period);
          calculations.push(calculation);
        }
      } catch (error) {
        console.error(`Error calculating payroll for employee ${employee.id}:`, error);
      }
    }

    return calculations;
  }

  // CSV Upload operations
  async getCsvUploads(): Promise<CsvUpload[]> {
    return await db.select().from(csvUploads).orderBy(desc(csvUploads.createdAt));
  }

  async getCsvUpload(batchId: string): Promise<CsvUpload | undefined> {
    const [upload] = await db.select().from(csvUploads).where(eq(csvUploads.batchId, batchId));
    return upload;
  }

  async createCsvUpload(upload: InsertCsvUpload): Promise<CsvUpload> {
    const [created] = await db.insert(csvUploads).values(upload).returning();
    return created;
  }

  async updateCsvUpload(batchId: string, upload: Partial<InsertCsvUpload>): Promise<CsvUpload> {
    const [updated] = await db
      .update(csvUploads)
      .set(upload)
      .where(eq(csvUploads.batchId, batchId))
      .returning();
    return updated;
  }

  async processTimesheetCsv(batchId: string, csvData: any[]): Promise<{processed: number, errors: any[]}> {
    const errors: any[] = [];
    const timesheetEntries: InsertTimesheetEntry[] = [];
    
    for (let i = 0; i < csvData.length; i++) {
      try {
        const row = csvData[i];
        
        if (!row.employeeId || !row.workDate || !row.hoursWorked) {
          errors.push({ row: i + 1, error: 'Missing required fields: employeeId, workDate, hoursWorked' });
          continue;
        }

        const employee = await this.getEmployee(parseInt(row.employeeId));
        if (!employee) {
          errors.push({ row: i + 1, error: `Employee not found: ${row.employeeId}` });
          continue;
        }

        const costCenters = await this.getAllCostCenters();
        const costCenter = costCenters.find(cc => cc.code === row.costCenterCode);
        if (!costCenter) {
          errors.push({ row: i + 1, error: `Cost center not found: ${row.costCenterCode}` });
          continue;
        }

        timesheetEntries.push({
          employeeId: employee.id,
          costCenterId: costCenter.id,
          workDate: row.workDate,
          hoursWorked: row.hoursWorked,
          overtimeHours: row.overtimeHours || '0',
          breakHours: row.breakHours || '0',
          checkInTime: row.checkInTime,
          checkOutTime: row.checkOutTime,
          remarks: row.remarks,
          uploadBatchId: batchId,
          isManualEntry: false
        });
      } catch (error) {
        errors.push({ row: i + 1, error: error instanceof Error ? error.message : String(error) });
      }
    }

    let processedCount = 0;
    if (timesheetEntries.length > 0) {
      await this.bulkCreateTimesheetEntries(timesheetEntries);
      processedCount = timesheetEntries.length;
    }

    await this.updateCsvUpload(batchId, {
      processedRecords: processedCount,
      errorRecords: errors.length,
      status: errors.length === 0 ? 'completed' : 'completed_with_errors',
      errorDetails: errors
    });

    return { processed: processedCount, errors };
  }
}

export const storage = new DatabaseStorage();
