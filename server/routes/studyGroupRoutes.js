const express = require('express');
const router = express.Router();
const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');

// Create a new study group - no auth required for testing
router.post('/', async (req, res) => {
  try {
    const { name, description, course, capacity, isPublic, studyGoal, userId } = req.body;
    
    // Instead of getting from JWT, get userId from request body
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'UserId is required to create a study group'
      });
    }
    
    // Create new study group
    const studyGroup = new StudyGroup({
      name,
      description,
      course,
      creator: userId,
      capacity: capacity || 5,
      isPublic: isPublic !== undefined ? isPublic : true,
      studyGoal: studyGoal || 'Regular Study',
      members: [{ user: userId, role: 'admin', joinedAt: new Date() }] // Add creator as admin member
    });
    
    await studyGroup.save();
    
    // Update user's createdStudyGroups and studyGroups arrays
    await User.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { 
          createdStudyGroups: studyGroup._id,
          studyGroups: studyGroup._id 
        }
      }
    );
    
    res.status(201).json({
      success: true,
      data: studyGroup
    });
  } catch (error) {
    console.error('Create study group error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all study groups
router.get('/', async (req, res) => {
  try {
    const studyGroups = await StudyGroup.find()
      .populate('creator', 'fullName email')
      .populate('members.user', 'fullName email');
    
    res.status(200).json({
      success: true,
      count: studyGroups.length,
      data: studyGroups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single study group
router.get('/:id', async (req, res) => {
  try {
    const studyGroup = await StudyGroup.findById(req.params.id)
      .populate('creator', 'fullName email')
      .populate('members.user', 'fullName email')
    //   .populate('course');
    
    if (!studyGroup) {
      return res.status(404).json({
        success: false,
        error: 'Study group not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: studyGroup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Join study group - no auth required for testing
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'UserId is required to join a study group'
      });
    }
    
    const studyGroup = await StudyGroup.findById(req.params.id);
    
    if (!studyGroup) {
      return res.status(404).json({
        success: false,
        error: 'Study group not found'
      });
    }
    
    // Check if already a member
    const alreadyJoined = studyGroup.members.some(
      member => member.user.toString() === userId.toString()
    );
    
    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        error: 'User is already a member of this study group'
      });
    }
    
    // Check if group is at capacity
    if (studyGroup.members.length >= studyGroup.capacity) {
      return res.status(400).json({
        success: false,
        error: 'Study group has reached maximum capacity'
      });
    }
    
    // Add user to members
    studyGroup.members.push({
      user: userId,
      role: 'member',
      joinedAt: new Date()
    });
    
    await studyGroup.save();
    
    // Update user's studyGroups array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { studyGroups: studyGroup._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Successfully joined study group',
      data: studyGroup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get study groups for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'studyGroups',
        populate: [
          { path: 'creator', select: 'fullName email' },
          { path: 'members.user', select: 'fullName email' }
        ]
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: user.studyGroups.length,
      data: user.studyGroups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;