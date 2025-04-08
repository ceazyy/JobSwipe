const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Update user profile
router.put('/profile', auth, [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('bio').optional().trim(),
  body('location.city').optional().trim(),
  body('location.state').optional().trim(),
  body('location.country').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user._id);
    const updates = req.body;

    // Update basic info
    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;

    // Update profile
    if (updates.phone) user.profile.phone = updates.phone;
    if (updates.bio) user.profile.bio = updates.bio;

    // Update location
    if (updates.location) {
      user.profile.location = {
        ...user.profile.location,
        ...updates.location
      };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload resume
router.post('/profile/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    user.profile.resume = req.file.path;
    await user.save();

    res.json({ message: 'Resume uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job preferences
router.put('/preferences', auth, [
  body('desiredRoles').optional().isArray(),
  body('industries').optional().isArray(),
  body('experienceLevel').optional().isIn(['entry', 'mid', 'senior', 'lead', 'executive']),
  body('salaryRange.min').optional().isNumeric(),
  body('salaryRange.max').optional().isNumeric(),
  body('remotePreference').optional().isIn(['remote', 'hybrid', 'onsite', 'any']),
  body('distance').optional().isNumeric(),
  body('skills').optional().isArray(),
  body('certifications').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user._id);
    user.jobPreferences = {
      ...user.jobPreferences,
      ...req.body
    };

    await user.save();
    res.json(user.jobPreferences);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's job preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('jobPreferences');
    res.json(user.jobPreferences);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 