import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LearningStyleResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login', { 
          state: { message: 'Please login to view your results' } 
        });
        return;
      }

      // Use environment-aware API URL
      const baseUrl = import.meta.env.PROD 
        ? 'https://studynexus-api.onrender.com' 
        : 'http://localhost:5000';
        
      const response = await axios.get(`${baseUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
        console.log('Fetched user data:', response.data);
      
      // Handle different response structures
      let userProfile = null;
      if (response.data.success && response.data.data?.user?.learningProfile) {
        userProfile = response.data.data.user.learningProfile;
      } else if (response.data.success && response.data.user?.learningProfile) {
        userProfile = response.data.user.learningProfile;
      }
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        // If no profile, redirect to assessment
        navigate('/assessment', { 
          state: { message: 'Please complete the assessment first' } 
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError('Failed to load your learning profile');
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login', { 
          state: { message: 'Your session has expired. Please login again.' } 
        });
      } else {
        // For other errors, redirect to assessment
        navigate('/assessment', { 
          state: { message: 'Unable to load results. Please retake the assessment.' } 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    console.log('LearningStyleResults mounted with user:', user);
    console.log('Location state:', location.state);
    
    // Get profile from navigation state or fetch from API
    if (location.state?.profile) {
      console.log('Using profile from navigation state:', location.state.profile);
      setProfile(location.state.profile);
    } else {
      console.log('No profile in navigation state, fetching from API...');
      // Fetch from API if not in navigation state
      fetchUserProfile();
    }
  }, [location.state, user, navigate]);
  
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
  };  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Results</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/assessment')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">No Assessment Results Found</h2>
          <p className="text-yellow-700 mb-4">Please complete the learning style assessment to see your results.</p>
          <button
            onClick={() => navigate('/assessment')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }  return (
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
          <p className="text-lg font-bold text-blue-800">
            {profile.learningStyle ? 
              `${profile.learningStyle.charAt(0).toUpperCase()}${profile.learningStyle.slice(1)} Learner` :
              'Learning Style Not Set'
            }
          </p>
          <p className="mt-2 text-gray-700">
            {profile.learningStyle ? getLearningStyleDescription(profile.learningStyle) : 'Please complete the assessment to see your learning style.'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Collaboration Style</h3>
          <p className="font-medium">
            {profile.collaborationStyle ? 
              `${profile.collaborationStyle.charAt(0).toUpperCase()}${profile.collaborationStyle.slice(1)}` :
              'Not Set'
            }
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {profile.collaborationStyle ? getLearningStyleDescription(profile.collaborationStyle) : 'Complete assessment to see results'}
          </p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Study Goals</h3>
          <p className="font-medium">
            {profile.studyGoals ? 
              `${profile.studyGoals.charAt(0).toUpperCase()}${profile.studyGoals.slice(1)}` :
              'Not Set'
            }
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {profile.studyGoals ? getLearningStyleDescription(profile.studyGoals) : 'Complete assessment to see results'}
          </p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Schedule Preference</h3>
          <p className="font-medium">
            {profile.schedulePreference ? 
              `${profile.schedulePreference.charAt(0).toUpperCase()}${profile.schedulePreference.slice(1)}` :
              'Not Set'
            }
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {profile.schedulePreference ? getLearningStyleDescription(profile.schedulePreference) : 'Complete assessment to see results'}
          </p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Subject Preference</h3>
          <p className="font-medium">
            {profile.subjectPreference ? (
              profile.subjectPreference === 'math_physics' ? 'Mathematics & Physics' : 
              profile.subjectPreference === 'computer_science' ? 'Computer Science & Technology' : 
              profile.subjectPreference === 'social_sciences' ? 'Social Sciences & Humanities' : 
              'Literature & Languages'
            ) : 'Not Set'}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {profile.subjectPreference ? getLearningStyleDescription(profile.subjectPreference) : 'Complete assessment to see results'}
          </p>
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
