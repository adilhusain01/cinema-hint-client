import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap, Play } from 'lucide-react';

// Modern Welcome Screen with emphasis on effortless discovery
const WelcomeScreen = ({ onNext }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    "No endless scrolling",
    "Personalized picks",
    "Perfect matches only"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Hero Section */}
        <div className="relative">
          {/* Floating elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
            {/* Icon with glow effect */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-2xl opacity-30 scale-150"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 mb-6 leading-tight">
              Your Perfect Movie
              <br />
              <span className="text-4xl font-normal text-white/70">is just 3 clicks away</span>
            </h1>

            {/* Animated feature text */}
            <div className="h-12 mb-8 flex items-center justify-center">
              <p className="text-2xl text-white/90 font-medium">
                {features[currentFeature]}
                <span className="inline-block ml-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-8 mb-8 text-white/70">
              <div className="text-center">
                <div className="text-2xl font-bold text-white"> 30s</div>
                <div className="text-sm">Time to pick</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm">Personalized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm">Effort required</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onNext}
              className="group relative bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 flex items-center space-x-3 mx-auto text-xl"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Find My Movie</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

           
          </div>
        </div>
      </div>
    </div>
  );
};


export default WelcomeScreen;