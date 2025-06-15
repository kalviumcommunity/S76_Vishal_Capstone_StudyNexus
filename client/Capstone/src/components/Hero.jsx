import React from 'react';
import libraryStudents from '../assets/library-students.png';

const Hero = () => {
  console.log(libraryStudents); // <-- Add this line

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
          {/* <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div> */}
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full px-8 py-16">
          <h1 className="text-5xl font-bold mb-6 text-center text-white">Connect, Collaborate, Conquer</h1>
          <p className="text-xl mb-8 text-center max-w-2xl text-white">
            StudyNexus is the AI-powered study group finder, making it easier than ever to connect with
            peers who share your academic goals.
          </p>
          <button className="bg-[#00EACC] text-black text-lg px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition">
            Join StudyNexus
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-4">Why StudyNexus?</h2>
        <p className="text-lg mb-12 max-w-3xl">
          Boost your academic performance with StudyNexus's innovative approach to collaborative learning.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ...feature cards... */}
        </div>
      </div>
    </>
  );
};

export default Hero;