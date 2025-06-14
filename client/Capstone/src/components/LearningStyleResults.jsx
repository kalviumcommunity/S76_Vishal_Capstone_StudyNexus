import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LearningStyleResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  
  // Define fetchUserProfile BEFORE using it in useEffect
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile/learning-style', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        // If no profile, redirect to assessment
        navigate('/learning-assessment', { 
          state: { message: 'Please complete the assessment first' } 
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate('/learning-assessment');
    }
  };  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Get profile from navigation state or fetch from API
    if (location.state?.profile) {
      setProfile(location.state.profile);
    } else {
      // Fetch from API if not in navigation state
      fetchUserProfile();
    }
  }, [location, currentUser, navigate]);
  
  const getLearningStyleDescription = (style) => {
    const descriptions = {
      visual: "You learn best through visual aids like diagrams, charts, and demonstrations.",
      auditory: "You learn best by listening to explanations and verbal instructions.",
      "reading/writing": "You prefer learning through reading materials and taking notes.",
      kinesthetic: "You learn best through hands-on experiences and practical activities.",
      collaborative: "You thrive in group study environments where ideas can be discussed.",
      independent: "You prefer studying independently at your own pace.",
      conceptual: "You focus on understanding core concepts and the big picture.",
      factual: "You excel at memorizing facts, details, and specific information.",
      practical: "You learn best by applying knowledge to solve real-world problems.",
      analytical: "You enjoy analyzing information and evaluating different perspectives.",
      structured: "You prefer regular, scheduled study sessions at fixed times.",
      flexible: "You like to study when you feel most productive, not on a rigid schedule.",
      intensive: "You prefer focused, longer study sessions with deeper immersion.",
      distributed: "You prefer shorter, more frequent study sessions.",
      math_physics: "You have a strong interest in Mathematics and Physics.",
      literature: "You have a strong interest in Literature and Languages.",
      computer_science: "You have a strong interest in Computer Science and Technology.",
      social_sciences: "You have a strong interest in Social Sciences and Humanities."
    };
    
    return descriptions[style] || "No description available";
  };
  
  const handleContinue = () => {
    navigate('/dashboard');
  };
  
  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8 text-center">
        <p>Loading your learning profile...</p>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">Your Learning Style Profile</h1>
      
      {location.state?.message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{location.state.message}</p>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Primary Learning Style</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-lg font-bold text-blue-800">{profile.learningStyle.charAt(0).toUpperCase() + profile.learningStyle.slice(1)} Learner</p>
          <p className="mt-2 text-gray-700">{getLearningStyleDescription(profile.learningStyle)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Collaboration Style</h3>
          <p className="font-medium">{profile.collaborationStyle.charAt(0).toUpperCase() + profile.collaborationStyle.slice(1)}</p>
          <p className="mt-1 text-sm text-gray-600">{getLearningStyleDescription(profile.collaborationStyle)}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Study Goals</h3>
          <p className="font-medium">{profile.studyGoals.charAt(0).toUpperCase() + profile.studyGoals.slice(1)}</p>
          <p className="mt-1 text-sm text-gray-600">{getLearningStyleDescription(profile.studyGoals)}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Schedule Preference</h3>
          <p className="font-medium">{profile.schedulePreference.charAt(0).toUpperCase() + profile.schedulePreference.slice(1)}</p>
          <p className="mt-1 text-sm text-gray-600">{getLearningStyleDescription(profile.schedulePreference)}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Subject Preference</h3>
          <p className="font-medium">
            {profile.subjectPreference === 'math_physics' ? 'Mathematics & Physics' : 
             profile.subjectPreference === 'computer_science' ? 'Computer Science & Technology' : 
             profile.subjectPreference === 'social_sciences' ? 'Social Sciences & Humanities' : 
             'Literature & Languages'}
          </p>
          <p className="mt-1 text-sm text-gray-600">{getLearningStyleDescription(profile.subjectPreference)}</p>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Use These Insights</h3>
        <p className="mb-2">
          Your learning style profile can help you optimize your study habits and find compatible study partners.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use study techniques that match your primary learning style</li>
          <li>Look for study partners with compatible styles and goals</li>
          <li>Organize your schedule according to your preferences</li>
        </ul>
      </div>
      
      <div className="text-center">
        <button 
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Find Study Groups
        </button>
      </div>
    </div>
  );
};

export default LearningStyleResults;
