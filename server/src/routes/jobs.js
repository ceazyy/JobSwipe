const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get jobs for swiping based on user preferences
router.get('/swipe', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { jobPreferences } = user;

    // Build query based on user preferences
    const query = {
      status: 'active',
      'location.type': { $in: [jobPreferences.remotePreference, 'any'] }
    };

    if (jobPreferences.desiredRoles?.length) {
      query.title = { $regex: jobPreferences.desiredRoles.join('|'), $options: 'i' };
    }

    if (jobPreferences.experienceLevel) {
      query['requirements.experience'] = jobPreferences.experienceLevel;
    }

    if (jobPreferences.industries?.length) {
      query.industry = { $in: jobPreferences.industries };
    }

    // Exclude already swiped jobs
    const swipedJobIds = user.swipedJobs.map(swipe => swipe.jobId);
    query._id = { $nin: swipedJobIds };

    // Get jobs within distance if specified
    if (jobPreferences.distance && user.profile.location?.coordinates) {
      query['location.address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.profile.location.coordinates
          },
          $maxDistance: jobPreferences.distance * 1609.34 // Convert miles to meters
        }
      };
    }

    const jobs = await Job.find(query)
      .limit(20)
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Swipe on a job
router.post('/swipe/:jobId', auth, [
  body('direction').isIn(['left', 'right'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId } = req.params;
    const { direction } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(req.user._id);

    // Record the swipe
    user.swipedJobs.push({
      jobId,
      direction,
      timestamp: new Date()
    });

    // If right swipe, create a match and auto-apply
    if (direction === 'right') {
      // Check if additional information is needed
      const missingInfo = [];
      if (job.applicationProcess.requiresResume && !user.profile.resume) {
        missingInfo.push('resume');
      }
      if (job.applicationProcess.requiresCoverLetter && !user.profile.coverLetter) {
        missingInfo.push('coverLetter');
      }

      // Auto-generate cover letter if needed
      if (missingInfo.includes('coverLetter')) {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a professional cover letter generator. Create a compelling cover letter based on the job description and user profile."
            },
            {
              role: "user",
              content: `Job Title: ${job.title}\nCompany: ${job.company.name}\nJob Description: ${job.description}\nUser Profile: ${JSON.stringify(user.profile)}`
            }
          ]
        });

        user.profile.coverLetter = completion.choices[0].message.content;
      }

      // Create match
      const match = {
        jobId,
        status: 'pending',
        matchDate: new Date()
      };

      user.matches.push(match);
      job.matches.push({
        userId: user._id,
        status: 'pending',
        matchDate: new Date()
      });

      await job.save();
    }

    await user.save();

    res.json({
      message: direction === 'right' ? 'Match created!' : 'Job skipped',
      missingInfo: direction === 'right' ? missingInfo : []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's matches
router.get('/matches', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'matches.jobId',
        select: 'title company description location salary'
      });

    res.json(user.matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 