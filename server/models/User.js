const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    lowercase: true
  },
  password: {
    type: String,
    // Only required for local auth, not for Google auth
    required: function() {
      return this.authProvider === 'local';
    },
    minlength: 6,
    select: false
  },
  // Google authentication fields
  googleId: {
    type: String,
    sparse: true
  },
  profilePicture: {
    type: String
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  // Add relationship fields to connect with StudyGroup
  createdStudyGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyGroup'
  }],
  studyGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyGroup'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
  // Note: MongoDB automatically adds _id field, you don't need to declare it
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and authProvider is local
  if (!this.isModified('password') || this.authProvider === 'google') return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  // For Google auth users with no password
  if (this.authProvider === 'google' && !this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;