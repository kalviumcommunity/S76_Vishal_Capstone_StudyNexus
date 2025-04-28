// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  // Basic Info
  fullName: {
    type: String,
    required: true,
    trim: true
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
    minlength: 8
  },
  profilePicture: {
    type: String,
    default: 'default-profile.jpg'
  },
  
  // Academic Info
  university: {
    type: String,
    trim: true
  },
  major: {
    type: String,
    trim: true
  },
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  
  // Learning Preferences
  learningStyle: {
    visual: { type: Number, default: 0 }, // 0-10 scale
    auditory: { type: Number, default: 0 },
    readingWriting: { type: Number, default: 0 },
    kinesthetic: { type: Number, default: 0 }
  },
  preferredStudyTime: {
    type: [String],
    enum: ['Morning', 'Afternoon', 'Evening', 'Late Night']
  },
  academicGoals: {
    type: [String],
    default: []
  },
  targetGradeLevel: {
    type: String,
    enum: ['A', 'B', 'C', 'Pass'],
    default: 'B'
  },
  
  // Study Groups
  studyGroups: [{
    type: Schema.Types.ObjectId,
    ref: 'StudyGroup'
  }],
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: String,
    endTime: String
  }],
  
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

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;