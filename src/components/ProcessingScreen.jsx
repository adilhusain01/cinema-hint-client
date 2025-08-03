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
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12">
        {/* Enhanced spinner with multiple layers */}
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-blue-400/30 border-b-transparent mx-auto" 
               style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
          
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-sm opacity-80 animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Finding your perfect movie...
        </h2>
        
        <p className="text-white/80 text-lg mb-6">
          {steps[currentStep]}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
          ></div>
        </div>

        <p className="text-white/60 text-sm">
          This won't take long...
        </p>
      </div>
    </div>
  );
};

export default ProcessingScreen