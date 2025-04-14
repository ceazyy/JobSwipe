import { Router } from 'express';
import { aggregateJobs } from '../services/jobAggregator';
import { applicationAgentApi } from '../services/applicationAgent';
import { storage } from '../storage';
import { z } from 'zod';

const router = Router();

// API endpoint to manually trigger job aggregation
router.post('/api/jobs/aggregate', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // For now, only allow admins to trigger aggregation
    // Later, this can be restricted to admin users
    const newJobsCount = await aggregateJobs();
    res.json({ success: true, message: `Aggregated ${newJobsCount} new jobs` });
  } catch (error) {
    console.error('Error aggregating jobs:', error);
    res.status(500).json({ message: 'Error aggregating jobs' });
  }
});

// API endpoint to get jobs filtered by criteria
router.get('/api/jobs/filtered', async (req, res) => {
  try {
    const { source, jobType, location, remote } = req.query;
    
    // Convert query params to filters
    const filters: any = {};
    if (source) filters.source = source;
    if (jobType) filters.jobType = jobType;
    if (location) filters.location = location;
    if (remote === 'true') filters.remote = true;
    
    // Get the jobs with filters (extend storage API if needed)
    const jobs = await storage.getJobs(filters);
    res.json(jobs);
  } catch (error) {
    console.error('Error getting filtered jobs:', error);
    res.status(500).json({ message: 'Error getting filtered jobs' });
  }
});

// API endpoint to submit job application
router.post('/api/jobs/:jobId/apply', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const jobId = parseInt(req.params.jobId);
    const userId = req.user.id;
    const { redirectToUser } = req.body;
    
    // Validate if this user has swiped right on this job
    const swipe = await storage.getSwipe(userId, jobId);
    if (!swipe || !swipe.liked) {
      return res.status(400).json({ message: 'You must swipe right on a job before applying' });
    }
    
    // Submit the application
    const result = await applicationAgentApi.submitApplication(userId, jobId, redirectToUser);
    
    res.json(result);
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ message: 'Error applying to job' });
  }
});

// API endpoint to check application status
router.get('/api/jobs/:jobId/application-status', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const jobId = parseInt(req.params.jobId);
    const userId = req.user.id;
    
    // Check if a match exists for this job and user
    const match = await storage.getMatch(userId, jobId);
    if (!match) {
      return res.status(404).json({ message: 'No application found for this job' });
    }
    
    // Check the application status
    const result = await applicationAgentApi.checkApplicationStatus(userId, jobId);
    res.json(result);
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({ message: 'Error checking application status' });
  }
});

export default router;