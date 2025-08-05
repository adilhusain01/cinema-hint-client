import React from 'react';
import { ChevronRight, Shield, ShieldCheck, Sparkles } from 'lucide-react';

const DealBreakers = ({ preferences = { dealBreakers: [] }, setPreferences, onNext }) => {

  const dealBreakers = [
    { id: 'No Horror', label: 'Horror Movies', icon: '👻' },
    { id: 'No Sad Endings', label: 'Sad Endings', icon: '😢' },
    { id: 'No Violence', label: 'Violence', icon: '⚔️' },
    { id: 'No Adult Content', label: 'Adult Content', icon: '🔞' },
    { id: 'No Subtitles', label: 'Subtitles', icon: '📝' },
    { id: 'No Old Movies (Pre-2000)', label: 'Old Movies (Pre-2000)', icon: '📼' },
    { id: 'No Long Movies (3+ hours)', label: 'Long Movies (3+ hrs)', icon: '⏰' },
    { id: 'No Animated Movies', label: 'Animated Movies', icon: '🎨' },
    { id: 'No Musicals', label: 'Musical Movies', icon: '🎵' }
  ];

  const toggleDealBreaker = (dealBreakerId) => {
    const newDealBreakers = preferences.dealBreakers.includes(dealBreakerId)
      ? preferences.dealBreakers.filter(db => db !== dealBreakerId)
      : [...preferences.dealBreakers, dealBreakerId];
    
    setPreferences({ ...preferences, dealBreakers: newDealBreakers });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-700/50 shadow-2xl min-h-[50vh]">
          <div className="text-center mb-6 sm:mb-8">
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Any deal-breakers?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Select what you'd prefer to avoid. We'll make sure your recommendation respects your preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {dealBreakers.map((dealBreaker) => {
              const isSelected = preferences.dealBreakers?.includes(dealBreaker.id);
              return (
                <button
                  key={dealBreaker.id}
                  onClick={() => toggleDealBreaker(dealBreaker.id)}
                  className={`group relative p-3 sm:p-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg border ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600/20 to-red-700/20 border-red-500/50 text-white shadow-lg shadow-red-500/20'
                      : 'bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-700/40 hover:border-gray-600/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <span className="text-lg sm:text-xl flex-shrink-0">{dealBreaker.icon}</span>
                      <span className="text-xs sm:text-sm lg:text-base truncate">{dealBreaker.label}</span>
                    </div>
                    
                    <div className={`flex-shrink-0 transition-all duration-200 ${
                      isSelected ? 'text-red-400 scale-110' : 'text-gray-500 group-hover:text-gray-400'
                    }`}>
                      {isSelected ? <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : <Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="text-center">
            {preferences.dealBreakers?.length > 0 && (
              <p className="text-gray-400 text-sm sm:text-base mb-4">
                {preferences.dealBreakers.length} deal-breaker{preferences.dealBreakers.length !== 1 ? 's' : ''} selected
              </p>
            )}
            
            <button
              onClick={onNext}
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 flex items-center space-x-2 sm:space-x-3 mx-auto text-sm sm:text-base lg:text-lg"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-200" />
              <span>Get My Perfect Movie</span>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealBreakers;
