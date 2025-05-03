// models/StudyGroup.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const studyGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 1000
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  // Links to creator user
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Members collection maintains the many-to-many relationship with users
  members: {
    type: [{
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
    validate: [function(val) {
      return val.length <= this.capacity;
    }, 'Group has reached maximum capacity']
  },
  capacity: {
    type: Number,
    default: 5,
    min: 2,
    max: 50
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  meetingSchedule: {
    type: [{
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
    validate: [
      {
        validator: validateScheduleTimeOrder,
        message: 'End time must be after start time'
      },
      {
        validator: function(val) { return val.length <= 14; }, // Max 2 meetings per day
        message: 'Exceeds the limit of meeting slots'
      }
    ]
  },
  studyGoal: {
    type: String,
    enum: ['Exam Preparation', 'Assignment Help', 'Project Collaboration', 'Regular Study', 'Concept Mastery'],
    default: 'Regular Study'
  },
  learningStyleFocus: {
    visual: { type: Number, default: 0, min: 0, max: 10 },
    auditory: { type: Number, default: 0, min: 0, max: 10 },
    readingWriting: { type: Number, default: 0, min: 0, max: 10 },
    kinesthetic: { type: Number, default: 0, min: 0, max: 10 }
  },
  messages: {
    type: [{
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      content: {
        type: String,
        required: true,
        maxLength: 2000
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    validate: [function(val) { return val.length <= 1000; }, 'Message limit reached, consider archiving older messages']
  },
  resources: {
    type: [{
      title: {
        type: String,
        required: true,
        maxLength: 200
      },
      description: {
        type: String,
        maxLength: 500
      },
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
    validate: [function(val) { return val.length <= 100; }, 'Resource limit reached']
  },
  events: {
    type: [{
      title: {
        type: String,
        required: true,
        maxLength: 200
      },
      description: {
        type: String,
        maxLength: 1000
      },
      startTime: Date,
      endTime: Date,
      location: String,
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    validate: [
      {
        validator: validateEventTimeOrder,
        message: 'Event end time must be after start time'
      },
      {
        validator: function(val) { return val.length <= 50; },
        message: 'Event limit reached'
      }
    ]
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
function validateScheduleTimeOrder(val) {
  for (let meeting of val) {
    if (meeting.startTime && meeting.endTime) {
      const start = new Date('1970/01/01 ' + meeting.startTime);
      const end = new Date('1970/01/01 ' + meeting.endTime);
      if (start >= end) return false;
    }
  }
  return true;
}

function validateEventTimeOrder(val) {
  for (let event of val) {
    if (event.startTime && event.endTime && event.startTime >= event.endTime) {
      return false;
    }
  }
  return true;
}

// Middleware to update updatedAt field before saving
studyGroupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add a post-save hook to update the user's createdStudyGroups and studyGroups fields
studyGroupSchema.post('save', async function(doc) {
  // If this is a new group, update the creator's createdStudyGroups array
  if (this.isNew) {
    try {
      const User = mongoose.model('User');
      // Update creator's createdStudyGroups
      await User.findByIdAndUpdate(
        doc.creator,
        { $addToSet: { createdStudyGroups: doc._id, studyGroups: doc._id } }
      );
      
      // For each member, update their studyGroups array
      for (const member of doc.members) {
        if (member.user.toString() !== doc.creator.toString()) {
          await User.findByIdAndUpdate(
            member.user,
            { $addToSet: { studyGroups: doc._id } }
          );
        }
      }
    } catch (error) {
      console.error('Error updating user references:', error);
    }
  }
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);
module.exports = StudyGroup;