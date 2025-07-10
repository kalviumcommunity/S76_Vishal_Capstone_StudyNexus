import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import api from '../services/api';

const LearningStyleAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { state: { message: 'Please login to take the assessment', redirectTo: '/assessment' } });
    } else if (location.state?.newUser) {
      // Show welcome message for new users
      setWelcomeMessage('Welcome! Please complete this assessment to help us personalize your experience.');
    } else if (location.state?.fromLogin) {
      // Show message for returning users
      setWelcomeMessage('Welcome back! Please complete or update your learning style assessment.');
    }
  }, [user, navigate, location]);

  // Learning style questions
  const questions = [
    {
      id: 1,
      text: "When learning something new, I prefer to:",
      options: [
        { id: 'a', text: "See diagrams, charts, or demonstrations", type: "visual" },
        { id: 'b', text: "Listen to explanations and lectures", type: "auditory" },
        { id: 'c', text: "Read explanations and take notes", type: "reading/writing" },
        { id: 'd', text: "Try it hands-on and learn by doing", type: "kinesthetic" }
      ]
    },
    {
      id: 2,
      text: "When studying with others, I prefer to:",
      options: [
        { id: 'a', text: "Discuss ideas and concepts together", type: "collaborative" },
        { id: 'b', text: "Work independently and compare results later", type: "independent" },
        { id: 'c', text: "Take turns explaining concepts to each other", type: "collaborative" },
        { id: 'd', text: "Work silently side-by-side", type: "independent" }
      ]
    },
    {
      id: 3,
      text: "When remembering information, I find it easiest to recall:",
      options: [
        { id: 'a', text: "Images and diagrams I've seen", type: "visual" },
        { id: 'b', text: "Things I've heard or said aloud", type: "auditory" },
        { id: 'c', text: "Notes I've written or text I've read", type: "reading/writing" },
        { id: 'd', text: "Activities I've performed or experiences I've had", type: "kinesthetic" }
      ]
    },
    {
      id: 4,
      text: "I learn best when my study goals are focused on:",
      options: [
        { id: 'a', text: "Understanding core concepts thoroughly", type: "conceptual" },
        { id: 'b', text: "Memorizing facts and details", type: "factual" },
        { id: 'c', text: "Applying knowledge to practical problems", type: "practical" },
        { id: 'd', text: "Analyzing and evaluating information", type: "analytical" }
      ]
    },
    {
      id: 5,
      text: "My ideal study schedule is:",
      options: [
        { id: 'a', text: "Regular, structured sessions at fixed times", type: "structured" },
        { id: 'b', text: "Flexible sessions when I feel most productive", type: "flexible" },
        { id: 'c', text: "Long, intensive study blocks", type: "intensive" },
        { id: 'd', text: "Short, frequent study sessions", type: "distributed" }
      ]
    },
    {
      id: 6,
      text: "Which subjects interest you the most?",
      options: [
        { id: 'a', text: "Mathematics and Physics", type: "math_physics" },
        { id: 'b', text: "Literature and Languages", type: "literature" },
        { id: 'c', text: "Computer Science and Technology", type: "computer_science" },
        { id: 'd', text: "Social Sciences and Humanities", type: "social_sciences" }
      ]
    }
  ];

  // Handle selecting an answer
  const handleSelectOption = (questionId, optionType) => {
    setAnswers({
      ...answers,
      [questionId]: optionType
    });
    
    // Move to next question or submit if last question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Go back to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  // Calculate learning style profile and submit
  const handleSubmit = async () => {
    if (loading) return;
    
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Submitting assessment answers:', answers);
      
      // Count occurrences of each learning style
      const counts = Object.values(answers).reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      console.log('Calculated counts:', counts);

      // Determine primary learning style
      const learningStyles = ['visual', 'auditory', 'reading/writing', 'kinesthetic'];
      const studyStyles = ['collaborative', 'independent'];
      const goalStyles = ['conceptual', 'factual', 'practical', 'analytical'];
      const scheduleStyles = ['structured', 'flexible', 'intensive', 'distributed'];
      const subjectPreferences = ['math_physics', 'literature', 'computer_science', 'social_sciences'];
      
      const profile = {
        learningStyle: findDominantType(counts, learningStyles) || 'visual',
        collaborationStyle: findDominantType(counts, studyStyles) || 'collaborative',
        studyGoals: findDominantType(counts, goalStyles) || 'conceptual',
        schedulePreference: findDominantType(counts, scheduleStyles) || 'flexible',
        subjectPreference: findDominantType(counts, subjectPreferences) || 'computer_science',
        rawScores: counts
      };
      
      console.log('Generated profile:', profile);
      console.log('About to save profile...');
      
      const result = await saveLearningProfile(profile);
      console.log('Profile saved successfully:', result);
      
      // Redirect to results page with the profile data
      navigate('/results', { 
        state: { 
          profile: result.profile || profile,
          message: 'Assessment completed successfully!',
          user: result.user
        } 
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to save your results. Please try again.';
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please login again.';
        // Redirect to login
        navigate('/login', { 
          state: { 
            message: errorMessage,
            redirectTo: '/assessment' 
          } 
        });
        return;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper to find dominant type in a category
  const findDominantType = (counts, typesList) => {
    let maxCount = 0;
    let dominantType = null;
    
    typesList.forEach(type => {
      if (counts[type] && counts[type] > maxCount) {
        maxCount = counts[type];
        dominantType = type;
      }
    });
    
    return dominantType;
  };

  // Save profile to database
  const saveLearningProfile = async (profile) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Saving profile with token:', token ? 'Token exists' : 'No token');
      console.log('Profile to save:', profile);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Use the API service instead of direct axios
      const response = await api.put(
        '/auth/learning-profile',
        { 
          learningStyle: profile.learningStyle,
          collaborationStyle: profile.collaborationStyle,
          studyGoals: profile.studyGoals,
          schedulePreference: profile.schedulePreference,
          subjectPreference: profile.subjectPreference,
          rawScores: profile.rawScores
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Backend response:', response.data);
      
      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          profile: response.data.data?.user?.learningProfile || profile,
          user: response.data.data?.user || response.data.user
        };
      } else {
        throw new Error(response.data.message || 'Failed to save learning profile');
      }
    } catch (error) {
      console.error('Error saving learning profile:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  if (!user) {
    return <div className="text-center p-8">Please login to take the assessment...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Learning Style Assessment</h1>
      
      {welcomeMessage && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded">
          {welcomeMessage}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].text}</h2>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option.id}
              className={`w-full text-left p-4 border ${
                answers[questions[currentQuestion].id] === option.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300'
              } rounded-lg transition-colors`}
              onClick={() => handleSelectOption(questions[currentQuestion].id, option.type)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-lg ${
            currentQuestion === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Previous
        </button>
        
        {currentQuestion === questions.length - 1 && (
          <button
            onClick={handleSubmit}
            disabled={loading || !answers[questions[currentQuestion].id]}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${
              loading || !answers[questions[currentQuestion].id]
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Complete Assessment'}
          </button>
        )}
      </div>
    </div>
  );
};

export default LearningStyleAssessment;