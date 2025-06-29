import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StudyGroups = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  const [joinedGroups, setJoinedGroups] = useState(['math-group-a', 'science-group-b']);
  const [successMessage, setSuccessMessage] = useState('');
  const [userRsvp, setUserRsvp] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Dummy data for available groups
  const [availableGroups, setAvailableGroups] = useState([
    {
      id: 'history-203',
      subject: 'History 203',
      name: 'Sarah and Group',
      description: 'Focuses on collaborative discussions and visual aids',
      members: 12,
      category: 'History',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'math-101',
      subject: 'Math 101',
      name: 'Tech Titan Team',
      description: 'Structured problem-solving sessions and active recall techniques',
      members: 8,
      category: 'Math',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'biology-150',
      subject: 'Biology 150',
      name: 'Bio Explorers',
      description: 'Interactive case studies and hands-on learning projects',
      members: 15,
      category: 'Biology',
      image: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ]);

  // User's active groups
  const myActiveGroups = [
    {
      id: 'math-group-a',
      category: 'Math Group A',
      name: 'Calculus Study Circle',
      schedule: 'Weekly meetings Tuesdays and Thursdays at 6 PM',
      members: 6,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      onlineMembers: [
        { id: 1, name: 'vishalm342', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', online: true },
        { id: 2, name: 'sarah_math', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b60b8e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', online: true },
        { id: 3, name: 'alex_calc', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', online: false }
      ],
      messages: [
        { id: 1, sender: 'sarah_math', content: 'Hey everyone! Ready for tomorrow\'s calculus review?', timestamp: '2:30 PM', type: 'text', read: true },
        { id: 2, sender: 'alex_calc', content: 'Yes! I\'ve prepared some practice problems for derivatives', timestamp: '2:32 PM', type: 'text', read: true },
        { id: 3, sender: 'vishalm342', content: 'Perfect! Can someone share the study materials?', timestamp: '2:35 PM', type: 'text', read: true },
        { id: 4, sender: 'sarah_math', content: 'calculus_notes.pdf', timestamp: '2:36 PM', type: 'file', read: false },
        { id: 5, sender: 'alex_calc', content: 'Thanks Sarah! See you all at 6 PM 📚', timestamp: '2:40 PM', type: 'text', read: false }
      ]
    },
    {
      id: 'science-group-b',
      category: 'Science Group B',
      name: 'Chemistry Lab Partners',
      schedule: 'Practicals on Mondays at 4 PM',
      members: 4,
      image: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      onlineMembers: [
        { id: 1, name: 'vishalm342', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', online: true },
        { id: 5, name: 'chem_master', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', online: true },
        { id: 6, name: 'lab_partner', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', online: false }
      ],
      messages: [
        { id: 1, sender: 'chem_master', content: 'Don\'t forget to bring safety goggles for tomorrow\'s lab!', timestamp: '1:15 PM', type: 'text', read: true },
        { id: 2, sender: 'lab_partner', content: 'Got it! What about the lab manual?', timestamp: '1:18 PM', type: 'text', read: true },
        { id: 3, sender: 'chem_master', content: 'lab_safety_guide.pdf', timestamp: '1:20 PM', type: 'file', read: true },
        { id: 4, sender: 'vishalm342', content: 'Thanks! Looking forward to the aspirin synthesis 🧪', timestamp: '1:25 PM', type: 'text', read: false },
        { id: 5, sender: 'lab_partner', content: 'Same here! Should be fun', timestamp: '1:27 PM', type: 'text', read: false }
      ]
    }
  ];

  // Upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      title: 'Calculus Review',
      group: 'Math Group A',
      time: 'Today 6:00 PM',
      date: 'June 28, 2025',
      duration: '2 hours',
      description: 'Comprehensive review of differential calculus concepts with practice problems',
      agenda: [
        'Review of derivatives and chain rule',
        'Practice problems solving',
        'Applications in real-world scenarios',
        'Q&A session'
      ],
      meetingLink: 'https://zoom.us/j/123456789',
      location: 'Library Room 301 (Hybrid)',
      attendees: [
        { id: 1, name: 'vishalm342', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'going' },
        { id: 2, name: 'sarah_math', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b60b8e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'going' },
        { id: 3, name: 'alex_calc', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'maybe' },
        { id: 4, name: 'emma_study', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'not-going' }
      ],
      resources: [
        { id: 1, name: 'Calculus Practice Problems.pdf', type: 'pdf', uploadedBy: 'sarah_math' },
        { id: 2, name: 'Derivative Rules Cheat Sheet.docx', type: 'doc', uploadedBy: 'alex_calc' }
      ],
      type: 'problem-solving'
    },
    {
      id: 2,
      title: 'Chemistry Practicals',
      group: 'Science Group B',
      time: 'Tomorrow 4:00 PM',
      date: 'June 29, 2025',
      duration: '3 hours',
      description: 'Hands-on laboratory session focusing on organic chemistry reactions',
      agenda: [
        'Safety briefing and equipment check',
        'Synthesis of aspirin experiment',
        'Analysis of reaction products',
        'Lab report guidelines'
      ],
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      location: 'Chemistry Lab B-204',
      attendees: [
        { id: 1, name: 'vishalm342', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'going' },
        { id: 5, name: 'chem_master', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'going' },
        { id: 6, name: 'lab_partner', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'going' }
      ],
      resources: [
        { id: 3, name: 'Lab Safety Guidelines.pdf', type: 'pdf', uploadedBy: 'chem_master' },
        { id: 4, name: 'Aspirin Synthesis Protocol.pdf', type: 'pdf', uploadedBy: 'chem_master' },
        { id: 5, name: 'Pre-lab Quiz.docx', type: 'doc', uploadedBy: 'lab_partner' }
      ],
      type: 'laboratory'
    },
    {
      id: 3,
      title: 'History Discussion',
      group: 'Social Science Group C',
      time: 'Friday 7:00 PM',
      date: 'June 30, 2025',
      duration: '1.5 hours',
      description: 'In-depth analysis of World War II historical events and their impact',
      agenda: [
        'Discussion of assigned readings',
        'Analysis of primary sources',
        'Debate on historical interpretations',
        'Next week\'s reading assignment'
      ],
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/xyz123',
      location: 'Online Only',
      attendees: [
        { id: 7, name: 'history_buff', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'going' },
        { id: 8, name: 'scholar_jane', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b60b8e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'going' },
        { id: 9, name: 'debate_king', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rsvp: 'maybe' }
      ],
      resources: [
        { id: 6, name: 'WWII Timeline.pdf', type: 'pdf', uploadedBy: 'history_buff' },
        { id: 7, name: 'Primary Sources Collection.zip', type: 'zip', uploadedBy: 'scholar_jane' },
        { id: 8, name: 'Discussion Questions.docx', type: 'doc', uploadedBy: 'history_buff' }
      ],
      type: 'discussion'
    }
  ];

  // Subject filters
  const subjects = ['all', 'Math', 'History', 'Biology', 'Chemistry', 'Physics'];

  const handleJoinGroup = (groupId, groupName) => {
    if (!joinedGroups.includes(groupId)) {
      setJoinedGroups([...joinedGroups, groupId]);
      setSuccessMessage(`Successfully joined ${groupName}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleRsvpChange = (sessionId, rsvpStatus) => {
    setUserRsvp({ ...userRsvp, [sessionId]: rsvpStatus });
    setSuccessMessage(`RSVP updated to "${rsvpStatus}"!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleJoinMeeting = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  const handleAddToCalendar = (session) => {
    // Create calendar event (placeholder functionality)
    const startDate = new Date(session.date + ' ' + session.time.split(' ')[1] + ' ' + session.time.split(' ')[2]);
    const title = encodeURIComponent(session.title);
    const details = encodeURIComponent(session.description);
    const location = encodeURIComponent(session.location);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const handleOpenChat = (group) => {
    setSelectedChatGroup(group);
    setShowChatPanel(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChatGroup) {
      const message = {
        id: Date.now(),
        sender: user?.username || 'vishalm342',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        read: false
      };
      
      // Add message to the group's messages (in real app, this would be sent to backend)
      selectedChatGroup.messages.push(message);
      setNewMessage('');
      setSuccessMessage('Message sent!');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp;
  };

  const filteredGroups = availableGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || group.category === selectedSubject;
    const notJoined = !joinedGroups.includes(group.id);
    return matchesSearch && matchesSubject && notJoined;
  });

  const CreateGroupModal = () => {
    const [groupData, setGroupData] = useState({
      name: '',
      subject: '',
      description: '',
      schedule: '',
      privacy: 'public',
      memberLimit: 10
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Create new group logic here
      console.log('Creating group:', groupData);
      setShowCreateModal(false);
      setSuccessMessage(`Successfully created ${groupData.name}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-6">Create New Study Group</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Group Name</label>
              <input
                type="text"
                value={groupData.name}
                onChange={(e) => setGroupData({...groupData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subject/Course</label>
              <select
                value={groupData.subject}
                onChange={(e) => setGroupData({...groupData, subject: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="History">History</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={groupData.description}
                onChange={(e) => setGroupData({...groupData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Meeting Schedule</label>
              <input
                type="text"
                value={groupData.schedule}
                onChange={(e) => setGroupData({...groupData, schedule: e.target.value})}
                placeholder="e.g., Tuesdays and Thursdays at 6 PM"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Member Limit</label>
              <input
                type="number"
                value={groupData.memberLimit}
                onChange={(e) => setGroupData({...groupData, memberLimit: parseInt(e.target.value)})}
                min="2"
                max="50"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const SessionDetailsModal = () => {
    if (!selectedSession) return null;

    const currentUserRsvp = userRsvp[selectedSession.id] || 'not-responded';
    const attendingCount = selectedSession.attendees.filter(a => a.rsvp === 'going').length;
    const maybeCount = selectedSession.attendees.filter(a => a.rsvp === 'maybe').length;

    const getFileIcon = (type) => {
      switch (type) {
        case 'pdf':
          return (
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          );
        case 'doc':
          return (
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          );
        case 'zip':
          return (
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          );
        default:
          return (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          );
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedSession.title}</h2>
                <p className="text-gray-600">{selectedSession.group}</p>
              </div>
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Meeting Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Meeting Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span><strong>Date:</strong> {selectedSession.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Time:</strong> {selectedSession.time}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Duration:</strong> {selectedSession.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span><strong>Location:</strong> {selectedSession.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700">{selectedSession.description}</p>
                </div>

                {/* Agenda */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Meeting Agenda</h3>
                  <ul className="space-y-2">
                    {selectedSession.agenda.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 font-medium">{index + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Pre-Meeting Resources</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                      Upload Resource
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedSession.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(resource.type)}
                          <div>
                            <p className="font-medium text-gray-900">{resource.name}</p>
                            <p className="text-sm text-gray-500">Uploaded by {resource.uploadedBy}</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm transition-colors">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* RSVP Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Your RSVP</h3>
                  <div className="space-y-2">
                    {['going', 'maybe', 'not-going'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleRsvpChange(selectedSession.id, status)}
                        className={`w-full p-2 rounded-lg text-left transition-all hover:scale-105 ${
                          currentUserRsvp === status
                            ? status === 'going' ? 'bg-green-200 border-green-400' 
                              : status === 'maybe' ? 'bg-yellow-200 border-yellow-400'
                              : 'bg-red-200 border-red-400'
                            : 'bg-white border-gray-200 hover:bg-gray-100'
                        } border`}
                      >
                        {status === 'going' ? '✓ Going' : status === 'maybe' ? '? Maybe' : '✗ Not Going'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Attendees ({attendingCount} going, {maybeCount} maybe)
                  </h3>
                  <div className="space-y-2">
                    {selectedSession.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <img
                          src={attendee.avatar}
                          alt={attendee.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{attendee.name}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          attendee.rsvp === 'going' ? 'bg-green-200 text-green-800' 
                          : attendee.rsvp === 'maybe' ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                        }`}>
                          {attendee.rsvp === 'going' ? 'Going' 
                           : attendee.rsvp === 'maybe' ? 'Maybe' 
                           : 'Not Going'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleJoinMeeting(selectedSession.meetingLink)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all hover:scale-105"
                  >
                    Join Meeting
                  </button>
                  <button
                    onClick={() => handleAddToCalendar(selectedSession)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
                  >
                    Add to Calendar
                  </button>
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all hover:scale-105">
                    Send Reminder
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all hover:scale-105">
                    Edit Meeting
                  </button>
                  <button className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-all hover:scale-105">
                    Cancel Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ChatPanel = () => {
    if (!selectedChatGroup) return null;

    const onlineCount = selectedChatGroup.onlineMembers.filter(m => m.online).length;

    return (
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        showChatPanel ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{selectedChatGroup.name}</h3>
              <p className="text-sm text-blue-100">{onlineCount} online • {selectedChatGroup.members} total</p>
            </div>
            <button
              onClick={() => setShowChatPanel(false)}
              className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Online Members */}
          <div className="flex items-center space-x-2 mt-3">
            {selectedChatGroup.onlineMembers.filter(m => m.online).map((member) => (
              <div key={member.id} className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  title={member.name}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)]">
            {selectedChatGroup.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === (user?.username || 'vishalm342') ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === (user?.username || 'vishalm342')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                } hover:shadow-md transition-shadow`}>
                  {message.sender !== (user?.username || 'vishalm342') && (
                    <p className="text-xs font-medium mb-1 opacity-70">{message.sender}</p>
                  )}
                  {message.type === 'file' ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm underline cursor-pointer">{message.content}</span>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70">{formatTimestamp(message.timestamp)}</p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              {/* Emoji Button */}
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* File Attachment */}
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
              {/* Message Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-lg transition-all hover:scale-105 ${
                  newMessage.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Study Groups</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || 'vishalm342'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('discover')}
            className={`pb-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'discover'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Discover Groups
          </button>
          <button
            onClick={() => setActiveTab('mygroups')}
            className={`pb-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'mygroups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Active Groups
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Discover Groups Tab */}
        {activeTab === 'discover' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Find your perfect Study Group</h2>
              
              {/* Subject Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                      selectedSubject === subject
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {subject === 'all' ? 'All Subjects' : subject}
                  </button>
                ))}
              </div>

              {/* Available Groups */}
              <div className="grid gap-6">
                {filteredGroups.map(group => (
                  <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-105">
                    <div className="flex">
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.subject}</h3>
                            <h4 className="text-xl font-bold text-blue-600 mb-2">{group.name}</h4>
                            <p className="text-gray-600 mb-4">{group.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                {group.members} members
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleJoinGroup(group.id, group.name)}
                            disabled={joinedGroups.includes(group.id)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                              joinedGroups.includes(group.id)
                                ? 'bg-green-600 text-white cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {joinedGroups.includes(group.id) ? (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Joined
                              </span>
                            ) : (
                              'Join Group'
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="w-48 h-32">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Groups Tab */}
        {activeTab === 'mygroups' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">My Active Study Groups</h2>
              <p className="text-gray-600 mb-6">Manage your ongoing study sessions and group collaborations</p>

              {/* Upcoming Sessions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
                <div className="space-y-3">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <p className="text-sm text-gray-500">{session.group} • {session.time}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewSession(session)}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all hover:scale-105"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Groups */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Groups</h3>
                <div className="grid gap-6">
                  {myActiveGroups.map(group => (
                    <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-105">
                      <div className="flex">
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-500 mb-1">{group.category}</h3>
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h4>
                              <p className="text-gray-600 mb-4">{group.schedule}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                  </svg>
                                  {group.members} members
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all hover:scale-105">
                                Manage
                              </button>
                              <button 
                                onClick={() => handleOpenChat(group)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
                              >
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w-48 h-32">
                          <img
                            src={group.image}
                            alt={group.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create New Group Floating Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Create Group Modal */}
      {showCreateModal && <CreateGroupModal />}

      {/* Session Details Modal */}
      {showSessionModal && <SessionDetailsModal />}

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  );
};

export default StudyGroups;
