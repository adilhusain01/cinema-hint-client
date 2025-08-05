import React, { useState, useEffect } from 'react';

const ProcessingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Analyzing your preferences...",
    "Scanning 10,000+ films...",
    "Finding perfect matches...",
    "Almost ready..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-10 lg:p-12 min-h-[80vh] flex flex-col justify-center text-center">
          {/* Enhanced spinner with multiple layers */}
          <div className="relative mb-6 sm:mb-8">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-400/30 border-b-transparent mx-auto" 
                 style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
            
            {/* Center glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-sm opacity-80 animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Finding your perfect movie...
          </h2>
          
          <p className="text-white/80 text-base sm:text-lg mb-4 sm:mb-6 px-4">
            {steps[currentStep]}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-3 sm:mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
            ></div>
          </div>

          <p className="text-white/60 text-xs sm:text-sm">
            This won't take long...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;