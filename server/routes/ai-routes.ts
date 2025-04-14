import { Router, Request, Response, NextFunction } from "express";
import { resumeAnalysisService, jobAnalysisService } from "../services/openaiService";
import { storage } from "../storage";

const aiRouter = Router();

// Extend express Request to include user property
declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
}

// Extract skills from user profile
aiRouter.get("/extract-skills", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const workExperiences = await storage.getUserWorkExperiences(userId);
    const educations = await storage.getUserEducations(userId);
    
    const skills = await resumeAnalysisService.extractSkillsFromProfile(
      user,
      workExperiences,
      educations
    );
    
    res.json({ skills });
  } catch (error) {
    console.error("Error extracting skills:", error);
    res.status(500).json({ message: "Failed to extract skills" });
  }
});

// Score job match based on user profile
aiRouter.get("/job-match/:jobId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const jobId = parseInt(req.params.jobId);
    
    const user = await storage.getUser(userId);
    const job = await storage.getJob(jobId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    const userSkills = await storage.getUserSkills(userId);
    
    const matchScore = await resumeAnalysisService.scoreJobMatch(
      user,
      job,
      userSkills
    );
    
    res.json(matchScore);
  } catch (error) {
    console.error("Error scoring job match:", error);
    res.status(500).json({ message: "Failed to score job match" });
  }
});

// Generate personalized cover letter
aiRouter.get("/cover-letter/:jobId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const jobId = parseInt(req.params.jobId);
    
    const user = await storage.getUser(userId);
    const job = await storage.getJob(jobId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    const workExperiences = await storage.getUserWorkExperiences(userId);
    
    const coverLetter = await resumeAnalysisService.generateCoverLetter(
      user,
      job,
      workExperiences
    );
    
    res.json({ coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({ message: "Failed to generate cover letter" });
  }
});

// Get interview tips for a job
aiRouter.get("/interview-tips/:jobId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.jobId);
    const job = await storage.getJob(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    const interviewTips = await resumeAnalysisService.getInterviewTips(job);
    
    res.json(interviewTips);
  } catch (error) {
    console.error("Error getting interview tips:", error);
    res.status(500).json({ message: "Failed to get interview tips" });
  }
});

// Extract job requirements
aiRouter.get("/job-requirements/:jobId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.jobId);
    const job = await storage.getJob(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    const jobRequirements = await jobAnalysisService.extractJobRequirements(job);
    
    res.json(jobRequirements);
  } catch (error) {
    console.error("Error extracting job requirements:", error);
    res.status(500).json({ message: "Failed to extract job requirements" });
  }
});

// Get application improvement suggestions
aiRouter.get("/application-improvements/:jobId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const jobId = parseInt(req.params.jobId);
    
    const user = await storage.getUser(userId);
    const job = await storage.getJob(jobId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    const improvements = await jobAnalysisService.suggestApplicationImprovements(
      user,
      job
    );
    
    res.json(improvements);
  } catch (error) {
    console.error("Error suggesting application improvements:", error);
    res.status(500).json({ message: "Failed to suggest application improvements" });
  }
});

export default aiRouter;