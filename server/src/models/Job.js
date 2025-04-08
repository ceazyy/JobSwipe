const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    name: {
      type: String,
      required: true
    },
    logo: String,
    description: String,
    website: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    }
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    experience: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive']
    },
    skills: [String],
    education: String,
    certifications: [String]
  },
  location: {
    type: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      required: true
    },
    address: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
      }
    }
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    isNegotiable: {
      type: Boolean,
      default: true
    }
  },
  benefits: [String],
  industry: String,
  department: String,
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  matches: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'matched', 'rejected'],
      default: 'pending'
    },
    matchDate: Date
  }],
  applicationProcess: {
    requiresResume: {
      type: Boolean,
      default: true
    },
    requiresCoverLetter: {
      type: Boolean,
      default: false
    },
    additionalQuestions: [{
      question: String,
      type: {
        type: String,
        enum: ['text', 'multiple-choice', 'file']
      },
      required: Boolean
    }]
  }
}, {
  timestamps: true
});

// Index for location-based queries
jobSchema.index({ 'location.address.coordinates': '2dsphere' });

// Index for text search
jobSchema.index({
  title: 'text',
  description: 'text',
  'company.name': 'text',
  'requirements.skills': 'text'
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job; 