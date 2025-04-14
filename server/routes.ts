import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage as dbStorage } from "./storage";
import path from "path";
import fs from "fs";
import multer from "multer";
import { z } from "zod";
import {
  insertUserSchema,
  insertSwipeSchema,
  insertRecruiterInterestSchema,
  insertWorkExperienceSchema,
  insertEducationSchema,
  insertSkillSchema,
} from "@shared/schema";
import { setupAuth } from "./auth";
import jobRoutes from "./routes/job-routes";
import aiRoutes from "./routes/ai-routes";
import { WebSocketServer } from "ws";
import { scheduleJobUpdates } from "./services/jobAggregator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Use job routes and AI routes
  app.use(jobRoutes);
  app.use('/api/ai', aiRoutes);
  // Configure multer for file uploads
  const uploadDir = path.join(process.cwd(), "uploads");
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const multerStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  
  const upload = multer({ 
    storage: multerStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
      const allowedTypes = ['.pdf', '.doc', '.docx', '.rtf'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        return cb(null, true);
      }
      cb(new Error('Only PDF, DOC, DOCX, and RTF files are allowed'));
    }
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await dbStorage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await dbStorage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  });

  app.patch("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await dbStorage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    try {
      const updatedUser = await dbStorage.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  // Job routes
  app.get("/api/jobs", async (_req, res) => {
    const jobs = await dbStorage.getJobs();
    res.json(jobs);
  });

  app.get("/api/jobs/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }
    
    const job = await dbStorage.getJob(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json(job);
  });

  // Swipe routes
  app.post("/api/swipes", async (req, res) => {
    try {
      const validatedData = insertSwipeSchema.parse(req.body);
      
      // Check if user has already swiped on this job
      const existingSwipe = await dbStorage.getSwipe(validatedData.userId, validatedData.jobId);
      if (existingSwipe) {
        return res.status(409).json({ message: "User has already swiped on this job" });
      }
      
      const swipe = await dbStorage.createSwipe(validatedData);
      res.status(201).json(swipe);
    } catch (error) {
      res.status(400).json({ message: "Invalid swipe data", error });
    }
  });

  app.get("/api/users/:userId/swipes", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const swipes = await dbStorage.getUserSwipes(userId);
    res.json(swipes);
  });

  // Recruiter interest routes (for simulation)
  app.post("/api/recruiter-interests", async (req, res) => {
    try {
      const validatedData = insertRecruiterInterestSchema.parse(req.body);
      const interest = await dbStorage.createRecruiterInterest(validatedData);
      res.status(201).json(interest);
    } catch (error) {
      res.status(400).json({ message: "Invalid recruiter interest data", error });
    }
  });

  // Match routes
  app.get("/api/users/:userId/matches", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const statusFilter = req.query.status as string;
    let matches;
    
    if (statusFilter) {
      matches = await dbStorage.getMatchesByStatus(userId, statusFilter);
    } else {
      matches = await dbStorage.getUserMatches(userId);
    }
    
    // Enhance matches with job details
    const enhancedMatches = await Promise.all(
      matches.map(async (match) => {
        const job = await dbStorage.getJob(match.jobId);
        return {
          ...match,
          job
        };
      })
    );
    
    res.json(enhancedMatches);
  });

  app.patch("/api/matches/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid match ID" });
    }
    
    const statusSchema = z.object({
      status: z.enum(["new", "in_process", "interview", "offer"])
    });
    
    try {
      const { status } = statusSchema.parse(req.body);
      const updatedMatch = await dbStorage.updateMatchStatus(id, status);
      
      if (!updatedMatch) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json(updatedMatch);
    } catch (error) {
      res.status(400).json({ message: "Invalid status", error });
    }
  });

  // Resume routes
  app.post("/api/users/:userId/resume", upload.single("resume"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }
    
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await dbStorage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete old resume if it exists
    if (user.resumePath) {
      const oldFilePath = path.join(uploadDir, path.basename(user.resumePath));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    
    const updatedUser = await dbStorage.updateUserResume(userId, req.file.path);
    res.json(updatedUser);
  });

  // Work Experience routes
  app.post("/api/work-experiences", async (req, res) => {
    try {
      const validatedData = insertWorkExperienceSchema.parse(req.body);
      const experience = await dbStorage.createWorkExperience(validatedData);
      res.status(201).json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid work experience data", error });
    }
  });

  app.get("/api/users/:userId/work-experiences", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const experiences = await dbStorage.getUserWorkExperiences(userId);
    res.json(experiences);
  });

  app.patch("/api/work-experiences/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid work experience ID" });
    }
    
    try {
      const updatedExperience = await dbStorage.updateWorkExperience(id, req.body);
      
      if (!updatedExperience) {
        return res.status(404).json({ message: "Work experience not found" });
      }
      
      res.json(updatedExperience);
    } catch (error) {
      res.status(400).json({ message: "Invalid work experience data", error });
    }
  });

  app.delete("/api/work-experiences/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid work experience ID" });
    }
    
    const success = await dbStorage.deleteWorkExperience(id);
    
    if (!success) {
      return res.status(404).json({ message: "Work experience not found" });
    }
    
    res.status(204).send();
  });

  // Education routes
  app.post("/api/educations", async (req, res) => {
    try {
      const validatedData = insertEducationSchema.parse(req.body);
      const education = await dbStorage.createEducation(validatedData);
      res.status(201).json(education);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data", error });
    }
  });

  app.get("/api/users/:userId/educations", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const educations = await dbStorage.getUserEducations(userId);
    res.json(educations);
  });

  app.patch("/api/educations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid education ID" });
    }
    
    try {
      const updatedEducation = await dbStorage.updateEducation(id, req.body);
      
      if (!updatedEducation) {
        return res.status(404).json({ message: "Education not found" });
      }
      
      res.json(updatedEducation);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data", error });
    }
  });

  app.delete("/api/educations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid education ID" });
    }
    
    const success = await dbStorage.deleteEducation(id);
    
    if (!success) {
      return res.status(404).json({ message: "Education not found" });
    }
    
    res.status(204).send();
  });

  // Skills routes
  app.post("/api/skills", async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await dbStorage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data", error });
    }
  });

  app.get("/api/users/:userId/skills", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const skills = await dbStorage.getUserSkills(userId);
    res.json(skills);
  });

  app.delete("/api/skills/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid skill ID" });
    }
    
    const success = await dbStorage.deleteSkill(id);
    
    if (!success) {
      return res.status(404).json({ message: "Skill not found" });
    }
    
    res.status(204).send();
  });

  // Create a demo user if one doesn't exist
  const demoUser = await dbStorage.getUserByUsername("demo");
  if (!demoUser) {
    await dbStorage.createUser({
      username: "demo",
      password: "demo123",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      title: "UX/UI Designer",
      location: "San Francisco, CA",
      about: "I'm a UX/UI Designer with 5 years of experience creating intuitive digital experiences. I specialize in user-centered design and have worked with startups and established companies across various industries."
    });

    // Create initial demo data (work experiences, education, skills)
    const userId = 1; // Demo user ID

    // Work experiences
    await dbStorage.createWorkExperience({
      userId,
      title: "Senior UX Designer",
      company: "DesignHub Inc.",
      startDate: "Jan 2021",
      endDate: "Present",
      current: true,
      description: "Led the redesign of the company's flagship product, resulting in a 30% increase in user engagement. Conducted user research and testing to validate design decisions."
    });

    await dbStorage.createWorkExperience({
      userId,
      title: "UX/UI Designer",
      company: "TechStart Solutions",
      startDate: "Mar 2018",
      endDate: "Dec 2020",
      current: false,
      description: "Designed user interfaces for web and mobile applications. Collaborated with development teams to ensure proper implementation of designs."
    });

    // Education
    await dbStorage.createEducation({
      userId,
      degree: "Bachelor of Fine Arts, Graphic Design",
      institution: "California Institute of Arts",
      startYear: "2014",
      endYear: "2018",
      description: "Graduated with honors. Specialized in digital media and interaction design."
    });

    // Skills
    const skills = ["Figma", "User Research", "Sketch", "Adobe Creative Suite", "Prototyping", "HTML/CSS", "JavaScript", "Responsive Design"];
    for (const name of skills) {
      await dbStorage.createSkill({ userId, name });
    }

    // Create some swipes and matches
    await dbStorage.createRecruiterInterest({ jobId: 1, userId: 1 });
    await dbStorage.createRecruiterInterest({ jobId: 2, userId: 1 });
    await dbStorage.createRecruiterInterest({ jobId: 3, userId: 1 });
  }

  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        if (data.type === 'job_search') {
          // Client is searching for jobs
          console.log('Client searching for jobs with filters:', data.filters);
          // In a production environment, we would send real-time job updates
        } else if (data.type === 'application_status') {
          // Client wants updates on an application
          console.log('Client requesting application status for job:', data.jobId);
          // In a production environment, we would send real-time status updates
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  // Schedule job updates to run every hour
  scheduleJobUpdates(60);
  
  return httpServer;
}
