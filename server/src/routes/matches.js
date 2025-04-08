const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all matches for a user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'matches.jobId',
        select: 'title company description location salary status'
      });

    res.json(user.matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update match status (for companies)
router.put('/:matchId', auth, [
  body('status').isIn(['matched', 'rejected'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { matchId } = req.params;
    const { status } = req.body;

    // Find the job that contains this match
    const job = await Job.findOne({
      'matches.userId': req.user._id,
      'matches._id': matchId
    });

    if (!job) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Update match status in job
    const matchIndex = job.matches.findIndex(
      match => match.userId.toString() === req.user._id.toString()
    );
    job.matches[matchIndex].status = status;
    await job.save();

    // Update match status in user
    const user = await User.findById(req.user._id);
    const userMatchIndex = user.matches.findIndex(
      match => match.jobId.toString() === job._id.toString()
    );
    user.matches[userMatchIndex].status = status;
    await user.save();

    // Emit socket event for real-time notification
    req.app.get('io').to(user._id.toString()).emit('matchUpdate', {
      jobId: job._id,
      status
    });

    res.json({ message: 'Match status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get match details
router.get('/:matchId', auth, async (req, res) => {
  try {
    const { matchId } = req.params;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'matches.jobId',
        match: { _id: matchId }
      });

    const match = user.matches.find(m => m.jobId._id.toString() === matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get match statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const stats = {
      total: user.matches.length,
      pending: user.matches.filter(m => m.status === 'pending').length,
      matched: user.matches.filter(m => m.status === 'matched').length,
      rejected: user.matches.filter(m => m.status === 'rejected').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 