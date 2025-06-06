import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./Auth";
import {
  insertEmployeeSchema,
  insertPayRecordSchema,
  insertTimeOffRequestSchema,
  insertNotificationSchema,
  insertEmployeeDocumentSchema,
  registerSchema,
  loginSchema,
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

// Extend express-session types to include 'email'
import "express-session";

declare module "express-session" {
  interface SessionData {
    email?: string;
    userId?: string;
  }
}

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
      const email = req.session.email;
      if (!email) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Fetch user and employee data
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      
      
      res.json({
        ...user,
        
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.upsertUser({
        id: nanoid(),
        email,
        password: hashedPassword,
        firstName,
        lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Set session
      req.session.userId = user.id;
      req.session.email = user.email;
      
      // Send response with user data (excluding password)
      res.status(201).json({
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Get user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });

      // Set session
      req.session.userId = user.id;
      req.session.email = user.email;
      req.session.save();
      
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
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

  // KPI Definition routes
  app.get("/api/kpi-definitions", isAuthenticated, async (req, res) => {
    try {
      const { department } = req.query;
      const kpis = department 
        ? await storage.getKpiDefinitionsByDepartment(department as string)
        : await storage.getAllKpiDefinitions();
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching KPI definitions:", error);
      res.status(500).json({ message: "Failed to fetch KPI definitions" });
    }
  });

  app.post("/api/kpi-definitions", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const kpi = await storage.createKpiDefinition({
        ...req.body,
        createdBy: req.employee.id,
      });
      res.status(201).json(kpi);
    } catch (error) {
      console.error("Error creating KPI definition:", error);
      res.status(500).json({ message: "Failed to create KPI definition" });
    }
  });

  app.patch("/api/kpi-definitions/:id", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const kpi = await storage.updateKpiDefinition(id, req.body);
      res.json(kpi);
    } catch (error) {
      console.error("Error updating KPI definition:", error);
      res.status(500).json({ message: "Failed to update KPI definition" });
    }
  });

  // Review Cycle routes
  app.get("/api/review-cycles", isAuthenticated, async (req, res) => {
    try {
      const { active } = req.query;
      const cycles = active === "true" 
        ? await storage.getActiveReviewCycles()
        : await storage.getAllReviewCycles();
      res.json(cycles);
    } catch (error) {
      console.error("Error fetching review cycles:", error);
      res.status(500).json({ message: "Failed to fetch review cycles" });
    }
  });

  app.post("/api/review-cycles", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const cycle = await storage.createReviewCycle({
        ...req.body,
        createdBy: req.employee.id,
      });
      res.status(201).json(cycle);
    } catch (error) {
      console.error("Error creating review cycle:", error);
      res.status(500).json({ message: "Failed to create review cycle" });
    }
  });

  app.patch("/api/review-cycles/:id", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const cycle = await storage.updateReviewCycle(id, req.body);
      res.json(cycle);
    } catch (error) {
      console.error("Error updating review cycle:", error);
      res.status(500).json({ message: "Failed to update review cycle" });
    }
  });

  // Employee KPI routes
  app.get("/api/employees/:employeeId/kpis", isAuthenticated, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const { reviewCycleId } = req.query;
      
      if (!reviewCycleId) {
        return res.status(400).json({ message: "Review cycle ID is required" });
      }

      const kpis = await storage.getEmployeeKpisByReviewCycle(
        employeeId, 
        parseInt(reviewCycleId as string)
      );
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching employee KPIs:", error);
      res.status(500).json({ message: "Failed to fetch employee KPIs" });
    }
  });

  app.post("/api/employees/:employeeId/kpis", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const kpi = await storage.assignKpiToEmployee({
        ...req.body,
        employeeId,
        assignedBy: req.employee.id,
      });
      res.status(201).json(kpi);
    } catch (error) {
      console.error("Error assigning KPI to employee:", error);
      res.status(500).json({ message: "Failed to assign KPI to employee" });
    }
  });

  app.patch("/api/employee-kpis/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const kpi = await storage.updateEmployeeKpi(id, req.body);
      res.json(kpi);
    } catch (error) {
      console.error("Error updating employee KPI:", error);
      res.status(500).json({ message: "Failed to update employee KPI" });
    }
  });

  // Performance Review routes
  app.get("/api/employees/:employeeId/performance-reviews", isAuthenticated, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const reviews = await storage.getPerformanceReviewsByEmployee(employeeId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching performance reviews:", error);
      res.status(500).json({ message: "Failed to fetch performance reviews" });
    }
  });

  app.get("/api/performance-reviews/reviewer", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const reviews = await storage.getPerformanceReviewsByReviewer(req.employee.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews for reviewer:", error);
      res.status(500).json({ message: "Failed to fetch reviews for reviewer" });
    }
  });

  app.post("/api/performance-reviews", isAuthenticated, async (req, res) => {
    try {
      const review = await storage.createPerformanceReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating performance review:", error);
      res.status(500).json({ message: "Failed to create performance review" });
    }
  });

  app.patch("/api/performance-reviews/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const review = await storage.updatePerformanceReview(id, req.body);
      res.json(review);
    } catch (error) {
      console.error("Error updating performance review:", error);
      res.status(500).json({ message: "Failed to update performance review" });
    }
  });

  app.get("/api/performance-reviews/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const review = await storage.getPerformanceReviewById(id);
      
      if (!review) {
        return res.status(404).json({ message: "Performance review not found" });
      }

      res.json(review);
    } catch (error) {
      console.error("Error fetching performance review:", error);
      res.status(500).json({ message: "Failed to fetch performance review" });
    }
  });

  // Performance Improvement Plan routes
  app.get("/api/employees/:employeeId/improvement-plans", isAuthenticated, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const plans = await storage.getPerformanceImprovementPlansByEmployee(employeeId);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching improvement plans:", error);
      res.status(500).json({ message: "Failed to fetch improvement plans" });
    }
  });

  app.post("/api/improvement-plans", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const plan = await storage.createPerformanceImprovementPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      console.error("Error creating improvement plan:", error);
      res.status(500).json({ message: "Failed to create improvement plan" });
    }
  });

  app.patch("/api/improvement-plans/:id", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.updatePerformanceImprovementPlan(id, req.body);
      res.json(plan);
    } catch (error) {
      console.error("Error updating improvement plan:", error);
      res.status(500).json({ message: "Failed to update improvement plan" });
    }
  });

  // Leave Management routes
  app.get("/api/employees/:employeeId/leave-balance", isAuthenticated, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const { year } = req.query;
      
      // Process latest accruals
      await storage.processLeaveAccruals(employeeId);
      
      const balance = await storage.getLeaveBalance(employeeId, year ? parseInt(year as string) : undefined);
      if (!balance) {
        return res.status(404).json({ message: "Leave balance not found" });
      }
      res.json(balance);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      res.status(500).json({ message: "Failed to fetch leave balance" });
    }
  });

  app.get("/api/employees/:employeeId/leave-accruals", isAuthenticated, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const accruals = await storage.getLeaveAccrualHistory(employeeId);
      res.json(accruals);
    } catch (error) {
      console.error("Error fetching leave accruals:", error);
      res.status(500).json({ message: "Failed to fetch leave accruals" });
    }
  });

  app.post("/api/leave-requests", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const { leaveType, startDate, endDate, days, reason, isWithPay, emergencyContact, workCoverage } = req.body;
      
      // Validate leave request
      const validation = await storage.validateLeaveRequest(req.employee.id, leaveType, parseFloat(days));
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Determine if approval is required (vacation leave always requires approval, casual leave for notification only)
      const requiresApproval = leaveType === "vacation";
      
      const leaveRequest = await storage.createTimeOffRequest({
        employeeId: req.employee.id,
        leaveType,
        startDate,
        endDate,
        days: parseFloat(days),
        reason,
        status: requiresApproval ? "pending" : "approved",
        requiresApproval,
        isWithPay: isWithPay !== false, // Default to true if not specified
        supervisorNotified: !requiresApproval, // Auto-notify for casual leave
        emergencyContact,
        workCoverage,
      });

      // If casual leave (just notification), automatically deduct balance
      if (!requiresApproval) {
        await storage.deductLeaveBalance(req.employee.id, leaveType, parseFloat(days));
      }

      res.status(201).json(leaveRequest);
    } catch (error) {
      console.error("Error creating leave request:", error);
      res.status(500).json({ message: "Failed to create leave request" });
    }
  });

  app.get("/api/leave-requests/my", isAuthenticated, getCurrentEmployee, async (req: any, res) => {
    try {
      const requests = await storage.getTimeOffRequestsByEmployee(req.employee.id);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });

  app.get("/api/leave-requests/pending-approval", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      // In a real implementation, this would filter by supervisor relationship
      const pendingRequests = await storage.getPendingTimeOffRequests();
      res.json(pendingRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      res.status(500).json({ message: "Failed to fetch pending requests" });
    }
  });

  app.patch("/api/leave-requests/:id/approve", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { comments } = req.body;
      
      // Get the leave request
      const request = await storage.getTimeOffRequestById(id);
      if (!request) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      // Validate that employee still has sufficient balance
      const validation = await storage.validateLeaveRequest(request.employeeId, request.leaveType, parseFloat(request.days));
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Approve request and deduct balance
      const updatedRequest = await storage.updateTimeOffRequest(id, {
        status: "approved",
        approverId: req.employee.id,
        responseDate: new Date(),
        approverComments: comments,
      });

      // Deduct from leave balance
      await storage.deductLeaveBalance(request.employeeId, request.leaveType, parseFloat(request.days));

      res.json(updatedRequest);
    } catch (error) {
      console.error("Error approving leave request:", error);
      res.status(500).json({ message: "Failed to approve leave request" });
    }
  });

  app.patch("/api/leave-requests/:id/deny", isAuthenticated, getCurrentEmployee, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { comments } = req.body;
      
      const updatedRequest = await storage.updateTimeOffRequest(id, {
        status: "denied",
        approverId: req.employee.id,
        responseDate: new Date(),
        approverComments: comments,
      });

      res.json(updatedRequest);
    } catch (error) {
      console.error("Error denying leave request:", error);
      res.status(500).json({ message: "Failed to deny leave request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
