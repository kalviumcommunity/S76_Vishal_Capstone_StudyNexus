// models/StudyGroup.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const studyGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  capacity: {
    type: Number,
    default: 5
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  meetingSchedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: String,
    endTime: String,
    location: {
      type: String,
      enum: ['Online', 'In-person', 'Hybrid'],
      default: 'Online'
    },
    locationDetails: String
  }],
  studyGoal: {
    type: String,
    enum: ['Exam Preparation', 'Assignment Help', 'Project Collaboration', 'Regular Study', 'Concept Mastery'],
    default: 'Regular Study'
  },
  learningStyleFocus: {
    visual: { type: Number, default: 0 }, // 0-10 scale
    auditory: { type: Number, default: 0 },
    readingWriting: { type: Number, default: 0 },
    kinesthetic: { type: Number, default: 0 }
  },
  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  resources: [{
    title: String,
    description: String,
    url: String,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  events: [{
    title: String,
    description: String,
    startTime: Date,
    endTime: Date,
    location: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studyGroupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);
module.exports = StudyGroup;