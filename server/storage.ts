import {
  users,
  employees,
  payRecords,
  timeOffRequests,
  notifications,
  employeeDocuments,
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
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
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
    return employee;
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
    const [newEmployee] = await db
      .insert(employees)
      .values(employee)
      .returning();
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
}

export const storage = new DatabaseStorage();
