const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profile: {
    phone: String,
    location: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
      }
    },
    bio: String,
    profilePicture: String,
    resume: String
  },
  jobPreferences: {
    desiredRoles: [String],
    industries: [String],
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive']
    },
    salaryRange: {
      min: Number,
      max: Number
    },
    remotePreference: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite', 'any']
    },
    distance: Number, // in miles/kilometers
    skills: [String],
    certifications: [String]
  },
  matches: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    status: {
      type: String,
      enum: ['pending', 'matched', 'rejected'],
      default: 'pending'
    },
    matchDate: Date
  }],
  swipedJobs: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    direction: {
      type: String,
      enum: ['left', 'right']
    },
    timestamp: Date
  }]
}, {
  timestamps: true
});

// Index for location-based queries
userSchema.index({ 'profile.location.coordinates': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 