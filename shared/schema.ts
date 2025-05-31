import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(), // Hashed password
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"), // user, admin
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employee profiles table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  employeeId: varchar("employee_id").notNull().unique(),
  department: varchar("department").notNull(),
  position: varchar("position").notNull(),
  startDate: date("start_date").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default("active"), // active, inactive, terminated
  managerId: integer("manager_id").references(() => employees.id),
  isAdmin: boolean("is_admin").notNull().default(false),
  phone: varchar("phone"),
  address: text("address"),
  emergencyContact: jsonb("emergency_contact"), // {name, phone, relationship}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pay records table
export const payRecords = pgTable("pay_records", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  payPeriodStart: date("pay_period_start").notNull(),
  payPeriodEnd: date("pay_period_end").notNull(),
  grossPay: decimal("gross_pay", { precision: 10, scale: 2 }).notNull(),
  netPay: decimal("net_pay", { precision: 10, scale: 2 }).notNull(),
  deductions: jsonb("deductions"), // {tax, insurance, retirement, etc}
  payDate: date("pay_date").notNull(),
  payType: varchar("pay_type").notNull().default("regular"), // regular, bonus, overtime
  createdAt: timestamp("created_at").defaultNow(),
});

// Time off requests table
export const timeOffRequests = pgTable("time_off_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  type: varchar("type").notNull(), // vacation, sick, personal, etc
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason"),
  status: varchar("status").notNull().default("pending"), // pending, approved, denied
  approverId: integer("approver_id").references(() => employees.id),
  requestDate: timestamp("request_date").defaultNow(),
  responseDate: timestamp("response_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leave balances table
export const leaveBalances = pgTable("leave_balances", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  casualLeaveBalance: decimal("casual_leave_balance", { precision: 5, scale: 2 }).notNull().default("0"),
  vacationLeaveBalance: decimal("vacation_leave_balance", { precision: 5, scale: 2 }).notNull().default("0"),
  lastAccrualDate: date("last_accrual_date").defaultNow(),
  lastQuarterAccrual: date("last_quarter_accrual"),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leave accrual history table
export const leaveAccruals = pgTable("leave_accrual_history", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  accrualType: varchar("accrual_type").notNull(), // casual, vacation
  accrualAmount: decimal("accrual_amount", { precision: 4, scale: 2 }).notNull(),
  accrualDate: date("accrual_date").notNull(),
  workingDaysCompleted: integer("working_days_completed"),
  quarterCompleted: integer("quarter_completed"),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull().default("info"), // info, warning, urgent, announcement
  senderId: integer("sender_id").notNull().references(() => employees.id),
  recipientId: integer("recipient_id").references(() => employees.id), // null for company-wide
  isRead: boolean("is_read").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  scheduledFor: timestamp("scheduled_for"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cost centers table
export const costCenters = pgTable("cost_centers", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description"),
  department: varchar("department"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Timesheet entries table
export const timesheetEntries = pgTable("timesheet_entries", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  costCenterId: integer("cost_center_id").notNull().references(() => costCenters.id),
  workDate: date("work_date").notNull(),
  hoursWorked: decimal("hours_worked", { precision: 4, scale: 2 }).notNull(),
  overtimeHours: decimal("overtime_hours", { precision: 4, scale: 2 }).notNull().default("0"),
  breakHours: decimal("break_hours", { precision: 4, scale: 2 }).notNull().default("0"),
  checkInTime: varchar("check_in_time"), // HH:MM format
  checkOutTime: varchar("check_out_time"), // HH:MM format
  remarks: text("remarks"),
  uploadBatchId: varchar("upload_batch_id"), // To track CSV upload batches
  isManualEntry: boolean("is_manual_entry").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payroll components table
export const payrollComponents = pgTable("payroll_components", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  costCenterId: integer("cost_center_id").references(() => costCenters.id),
  basicSalaryPerDay: decimal("basic_salary_per_day", { precision: 10, scale: 2 }).notNull(),
  transportAllowancePerDay: decimal("transport_allowance_per_day", { precision: 8, scale: 2 }).notNull().default("0"),
  foodAllowancePerDay: decimal("food_allowance_per_day", { precision: 8, scale: 2 }).notNull().default("0"),
  accommodationAllowancePerDay: decimal("accommodation_allowance_per_day", { precision: 8, scale: 2 }).notNull().default("0"),
  effectiveFrom: date("effective_from").notNull(),
  effectiveTo: date("effective_to"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payroll calculations table
export const payrollCalculations = pgTable("payroll_calculations", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  payrollPeriod: varchar("payroll_period").notNull(), // YYYY-MM format
  totalDaysWorked: decimal("total_days_worked", { precision: 4, scale: 1 }).notNull(),
  totalHoursWorked: decimal("total_hours_worked", { precision: 6, scale: 2 }).notNull(),
  overtimeHours: decimal("overtime_hours", { precision: 6, scale: 2 }).notNull().default("0"),
  leaveDaysTaken: decimal("leave_days_taken", { precision: 4, scale: 1 }).notNull().default("0"),
  
  // Calculated amounts
  basicSalary: decimal("basic_salary", { precision: 12, scale: 2 }).notNull(),
  transportAllowance: decimal("transport_allowance", { precision: 10, scale: 2 }).notNull().default("0"),
  foodAllowance: decimal("food_allowance", { precision: 10, scale: 2 }).notNull().default("0"),
  accommodationAllowance: decimal("accommodation_allowance", { precision: 10, scale: 2 }).notNull().default("0"),
  overtimePay: decimal("overtime_pay", { precision: 10, scale: 2 }).notNull().default("0"),
  
  grossSalary: decimal("gross_salary", { precision: 12, scale: 2 }).notNull(),
  deductions: decimal("deductions", { precision: 10, scale: 2 }).notNull().default("0"),
  netSalary: decimal("net_salary", { precision: 12, scale: 2 }).notNull(),
  
  calculatedAt: timestamp("calculated_at").defaultNow(),
  approvedBy: integer("approved_by").references(() => employees.id),
  approvedAt: timestamp("approved_at"),
  status: varchar("status").notNull().default("draft"), // draft, approved, paid
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CSV upload tracking table
export const csvUploads = pgTable("csv_uploads", {
  id: serial("id").primaryKey(),
  batchId: varchar("batch_id").notNull().unique(),
  fileName: varchar("file_name").notNull(),
  uploadType: varchar("upload_type").notNull(), // timesheet, payroll_components
  totalRecords: integer("total_records").notNull(),
  processedRecords: integer("processed_records").notNull(),
  errorRecords: integer("error_records").notNull(),
  uploadedBy: integer("uploaded_by").notNull().references(() => employees.id),
  status: varchar("status").notNull().default("processing"), // processing, completed, failed
  errorDetails: jsonb("error_details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee documents table
export const employeeDocuments = pgTable("employee_documents", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  documentType: varchar("document_type").notNull(), // contract, handbook, policy, etc
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url"), // For future file storage integration
  uploadedBy: integer("uploaded_by").notNull().references(() => employees.id),
  isConfidential: boolean("is_confidential").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// KPI definitions table
export const kpiDefinitions = pgTable("kpi_definitions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // performance, sales, quality, leadership, etc
  measurementType: varchar("measurement_type").notNull(), // numeric, percentage, rating, boolean
  targetValue: decimal("target_value", { precision: 10, scale: 2 }),
  unit: varchar("unit"), // %, $, hours, etc
  department: varchar("department"), // null for company-wide KPIs
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").notNull().references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance review cycles table
export const reviewCycles = pgTable("review_cycles", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // Q1 2024, Annual 2024, etc
  description: text("description"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reviewDeadline: date("review_deadline").notNull(),
  status: varchar("status").notNull().default("draft"), // draft, active, completed
  createdBy: integer("created_by").notNull().references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee KPI assignments table
export const employeeKpis = pgTable("employee_kpis", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  kpiId: integer("kpi_id").notNull().references(() => kpiDefinitions.id),
  reviewCycleId: integer("review_cycle_id").notNull().references(() => reviewCycles.id),
  targetValue: decimal("target_value", { precision: 10, scale: 2 }).notNull(),
  actualValue: decimal("actual_value", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull().default("1.00"), // Weight of this KPI in overall score
  assignedBy: integer("assigned_by").notNull().references(() => employees.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance reviews table
export const performanceReviews = pgTable("performance_reviews", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  reviewCycleId: integer("review_cycle_id").notNull().references(() => reviewCycles.id),
  reviewerId: integer("reviewer_id").notNull().references(() => employees.id), // Direct supervisor
  secondLevelReviewerId: integer("second_level_reviewer_id").references(() => employees.id), // Manager's manager
  
  // KPI Score (calculated from employee_kpis)
  kpiScore: decimal("kpi_score", { precision: 5, scale: 2 }),
  kpiWeightedScore: decimal("kpi_weighted_score", { precision: 5, scale: 2 }),
  
  // Supervisor subjective ratings (1-5 scale)
  communicationRating: integer("communication_rating"),
  teamworkRating: integer("teamwork_rating"),
  leadershipRating: integer("leadership_rating"),
  innovationRating: integer("innovation_rating"),
  reliabilityRating: integer("reliability_rating"),
  
  // Comments and feedback
  achievements: text("achievements"),
  areasForImprovement: text("areas_for_improvement"),
  goalsForNextPeriod: text("goals_for_next_period"),
  supervisorComments: text("supervisor_comments"),
  secondLevelComments: text("second_level_comments"),
  employeeSelfAssessment: text("employee_self_assessment"),
  
  // Overall ratings
  overallRating: decimal("overall_rating", { precision: 3, scale: 2 }), // Final calculated score
  recommendedAction: varchar("recommended_action"), // promote, maintain, improve, pip
  
  // Status and dates
  status: varchar("status").notNull().default("draft"), // draft, submitted, reviewed, approved, completed
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  approvedAt: timestamp("approved_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance improvement plans table
export const performanceImprovementPlans = pgTable("performance_improvement_plans", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  reviewId: integer("review_id").references(() => performanceReviews.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  objectives: jsonb("objectives").notNull(), // Array of improvement objectives
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  checkInFrequency: varchar("check_in_frequency").notNull().default("weekly"), // weekly, biweekly, monthly
  supervisorId: integer("supervisor_id").notNull().references(() => employees.id),
  status: varchar("status").notNull().default("active"), // active, completed, terminated
  outcome: varchar("outcome"), // successful, unsuccessful, extended
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  employee: one(employees, {
    fields: [users.id],
    references: [employees.userId],
  }),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
  }),
  directReports: many(employees),
  payRecords: many(payRecords),
  timeOffRequests: many(timeOffRequests),
  sentNotifications: many(notifications, { relationName: "sender" }),
  receivedNotifications: many(notifications, { relationName: "recipient" }),
  documents: many(employeeDocuments),
}));

export const payRecordsRelations = relations(payRecords, ({ one }) => ({
  employee: one(employees, {
    fields: [payRecords.employeeId],
    references: [employees.id],
  }),
}));

export const timeOffRequestsRelations = relations(timeOffRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [timeOffRequests.employeeId],
    references: [employees.id],
  }),
  approver: one(employees, {
    fields: [timeOffRequests.approverId],
    references: [employees.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  sender: one(employees, {
    fields: [notifications.senderId],
    references: [employees.id],
    relationName: "sender",
  }),
  recipient: one(employees, {
    fields: [notifications.recipientId],
    references: [employees.id],
    relationName: "recipient",
  }),
}));

export const costCentersRelations = relations(costCenters, ({ many }) => ({
  timesheetEntries: many(timesheetEntries),
  payrollComponents: many(payrollComponents),
}));

export const timesheetEntriesRelations = relations(timesheetEntries, ({ one }) => ({
  employee: one(employees, {
    fields: [timesheetEntries.employeeId],
    references: [employees.id],
  }),
  costCenter: one(costCenters, {
    fields: [timesheetEntries.costCenterId],
    references: [costCenters.id],
  }),
}));

export const payrollComponentsRelations = relations(payrollComponents, ({ one }) => ({
  employee: one(employees, {
    fields: [payrollComponents.employeeId],
    references: [employees.id],
  }),
  costCenter: one(costCenters, {
    fields: [payrollComponents.costCenterId],
    references: [costCenters.id],
  }),
}));

export const payrollCalculationsRelations = relations(payrollCalculations, ({ one }) => ({
  employee: one(employees, {
    fields: [payrollCalculations.employeeId],
    references: [employees.id],
  }),
  approvedBy: one(employees, {
    fields: [payrollCalculations.approvedBy],
    references: [employees.id],
    relationName: "approver",
  }),
}));

export const csvUploadsRelations = relations(csvUploads, ({ one }) => ({
  uploadedBy: one(employees, {
    fields: [csvUploads.uploadedBy],
    references: [employees.id],
  }),
}));

export const employeeDocumentsRelations = relations(employeeDocuments, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeDocuments.employeeId],
    references: [employees.id],
  }),
  uploadedBy: one(employees, {
    fields: [employeeDocuments.uploadedBy],
    references: [employees.id],
  }),
}));

export const kpiDefinitionsRelations = relations(kpiDefinitions, ({ one, many }) => ({
  createdBy: one(employees, {
    fields: [kpiDefinitions.createdBy],
    references: [employees.id],
  }),
  employeeKpis: many(employeeKpis),
}));

export const reviewCyclesRelations = relations(reviewCycles, ({ one, many }) => ({
  createdBy: one(employees, {
    fields: [reviewCycles.createdBy],
    references: [employees.id],
  }),
  employeeKpis: many(employeeKpis),
  performanceReviews: many(performanceReviews),
}));

export const employeeKpisRelations = relations(employeeKpis, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeKpis.employeeId],
    references: [employees.id],
  }),
  kpiDefinition: one(kpiDefinitions, {
    fields: [employeeKpis.kpiId],
    references: [kpiDefinitions.id],
  }),
  reviewCycle: one(reviewCycles, {
    fields: [employeeKpis.reviewCycleId],
    references: [reviewCycles.id],
  }),
  assignedBy: one(employees, {
    fields: [employeeKpis.assignedBy],
    references: [employees.id],
  }),
}));

export const performanceReviewsRelations = relations(performanceReviews, ({ one }) => ({
  employee: one(employees, {
    fields: [performanceReviews.employeeId],
    references: [employees.id],
  }),
  reviewCycle: one(reviewCycles, {
    fields: [performanceReviews.reviewCycleId],
    references: [reviewCycles.id],
  }),
  reviewer: one(employees, {
    fields: [performanceReviews.reviewerId],
    references: [employees.id],
    relationName: "reviewer",
  }),
  secondLevelReviewer: one(employees, {
    fields: [performanceReviews.secondLevelReviewerId],
    references: [employees.id],
    relationName: "secondLevelReviewer",
  }),
}));

export const performanceImprovementPlansRelations = relations(performanceImprovementPlans, ({ one }) => ({
  employee: one(employees, {
    fields: [performanceImprovementPlans.employeeId],
    references: [employees.id],
  }),
  review: one(performanceReviews, {
    fields: [performanceImprovementPlans.reviewId],
    references: [performanceReviews.id],
  }),
  supervisor: one(employees, {
    fields: [performanceImprovementPlans.supervisorId],
    references: [employees.id],
  }),
}));

// Insert schemas
export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayRecordSchema = createInsertSchema(payRecords).omit({
  id: true,
  createdAt: true,
});

export const insertTimeOffRequestSchema = createInsertSchema(timeOffRequests).omit({
  id: true,
  requestDate: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertEmployeeDocumentSchema = createInsertSchema(employeeDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertKpiDefinitionSchema = createInsertSchema(kpiDefinitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewCycleSchema = createInsertSchema(reviewCycles).omit({
  id: true,
  createdAt: true,
});

export const insertEmployeeKpiSchema = createInsertSchema(employeeKpis).omit({
  id: true,
  assignedAt: true,
  updatedAt: true,
});

export const insertPerformanceReviewSchema = createInsertSchema(performanceReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerformanceImprovementPlanSchema = createInsertSchema(performanceImprovementPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaveBalanceSchema = createInsertSchema(leaveBalances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaveAccrualSchema = createInsertSchema(leaveAccruals).omit({
  id: true,
  createdAt: true,
});

export const insertCostCenterSchema = createInsertSchema(costCenters).omit({
  id: true,
  createdAt: true,
});

export const insertTimesheetEntrySchema = createInsertSchema(timesheetEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayrollComponentSchema = createInsertSchema(payrollComponents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayrollCalculationSchema = createInsertSchema(payrollCalculations).omit({
  id: true,
  calculatedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCsvUploadSchema = createInsertSchema(csvUploads).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertPayRecord = z.infer<typeof insertPayRecordSchema>;
export type PayRecord = typeof payRecords.$inferSelect;
export type InsertTimeOffRequest = z.infer<typeof insertTimeOffRequestSchema>;
export type TimeOffRequest = typeof timeOffRequests.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertEmployeeDocument = z.infer<typeof insertEmployeeDocumentSchema>;
export type EmployeeDocument = typeof employeeDocuments.$inferSelect;

// Leave Management Types
export type InsertLeaveBalance = z.infer<typeof insertLeaveBalanceSchema>;
export type LeaveBalance = typeof leaveBalances.$inferSelect;
export type InsertLeaveAccrual = z.infer<typeof insertLeaveAccrualSchema>;
export type LeaveAccrual = typeof leaveAccruals.$inferSelect;

// Timesheet and Payroll Types
export type InsertCostCenter = z.infer<typeof insertCostCenterSchema>;
export type CostCenter = typeof costCenters.$inferSelect;
export type InsertTimesheetEntry = z.infer<typeof insertTimesheetEntrySchema>;
export type TimesheetEntry = typeof timesheetEntries.$inferSelect;
export type InsertPayrollComponent = z.infer<typeof insertPayrollComponentSchema>;
export type PayrollComponent = typeof payrollComponents.$inferSelect;
export type InsertPayrollCalculation = z.infer<typeof insertPayrollCalculationSchema>;
export type PayrollCalculation = typeof payrollCalculations.$inferSelect;
export type InsertCsvUpload = z.infer<typeof insertCsvUploadSchema>;
export type CsvUpload = typeof csvUploads.$inferSelect;

// Performance Review Types
export type InsertKpiDefinition = z.infer<typeof insertKpiDefinitionSchema>;
export type KpiDefinition = typeof kpiDefinitions.$inferSelect;
export type InsertReviewCycle = z.infer<typeof insertReviewCycleSchema>;
export type ReviewCycle = typeof reviewCycles.$inferSelect;
export type InsertEmployeeKpi = z.infer<typeof insertEmployeeKpiSchema>;
export type EmployeeKpi = typeof employeeKpis.$inferSelect;
export type InsertPerformanceReview = z.infer<typeof insertPerformanceReviewSchema>;
export type PerformanceReview = typeof performanceReviews.$inferSelect;
export type InsertPerformanceImprovementPlan = z.infer<typeof insertPerformanceImprovementPlanSchema>;
export type PerformanceImprovementPlan = typeof performanceImprovementPlans.$inferSelect;

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
