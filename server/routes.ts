import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertEmployeeSchema,
  insertPayRecordSchema,
  insertTimeOffRequestSchema,
  insertNotificationSchema,
  insertEmployeeDocumentSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Middleware to get current employee
  const getCurrentEmployee = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const employee = await storage.getEmployeeByUserId(userId);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee profile not found" });
      }
      
      req.employee = employee;
      next();
    } catch (error) {
      console.error("Error getting current employee:", error);
      res.status(500).json({ message: "Failed to get employee data" });
    }
  };

  // Admin middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.employee?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const employee = await storage.getEmployeeByUserId(userId);
      
      res.json({
        ...user,
        employee,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Employee routes
  app.get("/api/employees/me", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    res.json(req.employee);
  });

  app.put("/api/employees/me", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const updateData = insertEmployeeSchema.partial().parse(req.body);
      const updatedEmployee = await storage.updateEmployee(req.employee.id, updateData);
      res.json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(400).json({ message: "Invalid employee data" });
    }
  });

  // Pay routes
  app.get("/api/pay/records", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const payRecords = await storage.getPayRecordsByEmployee(req.employee.id);
      res.json(payRecords);
    } catch (error) {
      console.error("Error fetching pay records:", error);
      res.status(500).json({ message: "Failed to fetch pay records" });
    }
  });

  app.get("/api/pay/latest", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const latestPay = await storage.getLatestPayRecord(req.employee.id);
      res.json(latestPay);
    } catch (error) {
      console.error("Error fetching latest pay record:", error);
      res.status(500).json({ message: "Failed to fetch latest pay record" });
    }
  });

  // Time off routes
  app.get("/api/timeoff/requests", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const requests = await storage.getTimeOffRequestsByEmployee(req.employee.id);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching time off requests:", error);
      res.status(500).json({ message: "Failed to fetch time off requests" });
    }
  });

  app.post("/api/timeoff/requests", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const requestData = insertTimeOffRequestSchema.parse({
        ...req.body,
        employeeId: req.employee.id,
      });
      const newRequest = await storage.createTimeOffRequest(requestData);
      res.json(newRequest);
    } catch (error) {
      console.error("Error creating time off request:", error);
      res.status(400).json({ message: "Invalid time off request data" });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const notifications = await storage.getNotificationsByEmployee(req.employee.id);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread-count", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const count = await storage.getUnreadNotificationCount(req.employee.id);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Document routes
  app.get("/api/documents", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const documents = await storage.getDocumentsByEmployee(req.employee.id);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Admin routes
  app.get("/api/admin/employees", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const { department } = req.query;
      let employees = await storage.getAllEmployees();
      
      if (department && department !== "all") {
        employees = employees.filter(emp => emp.department === department);
      }
      
      res.json(employees);
    } catch (error) {
      console.error("Error fetching all employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.post("/api/admin/employees", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const newEmployee = await storage.createEmployee(employeeData);
      res.json(newEmployee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(400).json({ message: "Invalid employee data" });
    }
  });

  app.get("/api/admin/employees/:id", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployeeWithUser(id);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.put("/api/admin/employees/:id", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertEmployeeSchema.partial().parse(req.body);
      const updatedEmployee = await storage.updateEmployee(id, updateData);
      res.json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(400).json({ message: "Invalid employee data" });
    }
  });

  // Admin notification routes
  app.post("/api/admin/notifications", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const notificationData = insertNotificationSchema.parse({
        ...req.body,
        senderId: req.employee.id,
      });
      const newNotification = await storage.createNotification(notificationData);
      res.json(newNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(400).json({ message: "Invalid notification data" });
    }
  });

  app.get("/api/admin/notifications/company", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const notifications = await storage.getCompanyWideNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching company notifications:", error);
      res.status(500).json({ message: "Failed to fetch company notifications" });
    }
  });

  // Admin statistics
  app.get("/api/admin/stats", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const [
        employeeCount,
        newHires,
        pendingApprovals,
        activeNotifications,
      ] = await Promise.all([
        storage.getEmployeeCount(),
        storage.getNewHiresThisMonth(),
        storage.getPendingTimeOffRequests(),
        storage.getActiveNotifications(),
      ]);

      res.json({
        totalEmployees: employeeCount,
        newHires,
        pendingApprovals,
        activeNotifications,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
  });

  // Admin pay record management
  app.post("/api/admin/pay-records", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const payRecordData = insertPayRecordSchema.parse(req.body);
      const newPayRecord = await storage.createPayRecord(payRecordData);
      res.json(newPayRecord);
    } catch (error) {
      console.error("Error creating pay record:", error);
      res.status(400).json({ message: "Invalid pay record data" });
    }
  });

  // Admin time off approval
  app.put("/api/admin/timeoff/:id/approve", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedRequest = await storage.updateTimeOffRequest(id, {
        status: "approved",
        approverId: req.employee.id,
        responseDate: new Date(),
      });
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error approving time off request:", error);
      res.status(500).json({ message: "Failed to approve time off request" });
    }
  });

  app.put("/api/admin/timeoff/:id/deny", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedRequest = await storage.updateTimeOffRequest(id, {
        status: "denied",
        approverId: req.employee.id,
        responseDate: new Date(),
      });
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error denying time off request:", error);
      res.status(500).json({ message: "Failed to deny time off request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
