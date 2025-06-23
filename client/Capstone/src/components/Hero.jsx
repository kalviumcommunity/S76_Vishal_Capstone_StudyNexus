import React from 'react';
import { Link } from 'react-router-dom';
import libraryStudents from '../assets/library-students.png';

const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <div
        className="relative rounded-lg mb-12 overflow-hidden max-w-5xl mx-auto flex items-center justify-center"
        style={{
          backgroundImage: `url(${libraryStudents})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '380px',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full px-8 py-16">
          <h1 className="text-5xl font-bold mb-6 text-center text-white">Connect, Collaborate, Conquer</h1>
          <p className="text-xl mb-8 text-center max-w-2xl text-white">
            StudyNexus is the AI-powered study group finder, making it easier than ever to connect with
            peers who share your academic goals.
          </p>
          <Link to="/register">
            <button className="bg-[#00EACC] text-black text-lg px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition">
              Join StudyNexus
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-4 text-center">Why StudyNexus?</h2>
        <p className="text-lg mb-12 max-w-3xl mx-auto text-center">
          Boost your academic performance with StudyNexus's innovative approach to collaborative learning.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Intelligent Matching */}
          <div className="border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Intelligent Matching</h3>
            <p className="text-gray-600">
              Our AI algorithm matches you with study groups based on your courses, learning style, and goals.
            </p>
          </div>

          {/* Seamless Collaboration */}
          <div className="border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Seamless Collaboration</h3>
            <p className="text-gray-600">
              Integrated tools for scheduling, sharing resources, and real-time communication.
            </p>
          </div>

          {/* Progress Tracking */}
          <div className="border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your group's progress and identify areas needing more focus.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-8">
          Ready to Elevate Your Study Game?
        </h2>
        <Link to="/register">
          <button className="bg-[#00EACC] text-black px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition">
            Join StudyNexus Now
          </button>
        </Link>
      </div>
    </>
  );
};

export default Hero;