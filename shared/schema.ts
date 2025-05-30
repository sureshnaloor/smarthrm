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
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
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
