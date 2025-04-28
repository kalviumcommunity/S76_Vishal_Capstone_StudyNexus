// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Add this dependency
const { Schema } = mongoose;

const userSchema = new Schema({
  // Basic Info
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100 // Added length constraint
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Don't include password in query results by default
  },
  profilePicture: {
    type: String,
    default: 'default-profile.jpg'
  },
  
  // Academic Info
  university: {
    type: String,
    trim: true,
    maxLength: 100
  },
  major: {
    type: String,
    trim: true,
    maxLength: 100
  },
  courses: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }],
    validate: [coursesLimit, 'Exceeds the limit of 20 courses'] // Limit array size
  },
  
  // Learning Preferences
  learningStyle: {
    visual: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 10
    },
    auditory: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 10
    },
    readingWriting: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 10
    },
    kinesthetic: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 10
    }
  },
  preferredStudyTime: {
    type: [String],
    enum: ['Morning', 'Afternoon', 'Evening', 'Late Night'],
    validate: [arrayLimit(5), 'Exceeds the limit of preferred study times']
  },
  academicGoals: {
    type: [String],
    default: [],
    validate: [arrayLimit(10), 'Exceeds the limit of academic goals']
  },
  targetGradeLevel: {
    type: String,
    enum: ['A', 'B', 'C', 'Pass'],
    default: 'B'
  },
  
  // Study Groups
  studyGroups: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'StudyGroup'
    }],
    validate: [arrayLimit(20), 'Exceeds the limit of study groups']
  },
  availability: {
    type: [{
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      startTime: String,
      endTime: String
    }],
    validate: [
      {
        validator: validateTimeOrder,
        message: 'End time must be after start time'
      },
      {
        validator: arrayLimit(21), // 3 slots per day max
        message: 'Exceeds the limit of availability slots'
      }
    ]
  },
  
  // System Info
  googleCalendarConnected: {
    type: Boolean,
    default: false
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'microsoft'],
    default: 'local'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validator functions
function arrayLimit(limit) {
  return function(val) {
    return val.length <= limit;
  };
}

function coursesLimit(val) {
  return val.length <= 20;
}

function validateTimeOrder(val) {
  for (let slot of val) {
    if (slot.startTime && slot.endTime) {
      const start = new Date('1970/01/01 ' + slot.startTime);
      const end = new Date('1970/01/01 ' + slot.endTime);
      if (start >= end) return false;
    }
  }
  return true;
}

// Password hashing middleware
userSchema.pre('save', async function(next) {
  // Update the timestamp
  this.updatedAt = Date.now();
  
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;