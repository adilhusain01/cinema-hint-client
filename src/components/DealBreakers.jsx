import React from 'react';
import { ChevronRight, Users, X } from 'lucide-react';

const DealBreakers = ({ preferences, setPreferences, onNext }) => {

  console.log('Preferences from DealBreakers', preferences);

  const dealBreakers = [
    'No Horror', 'No Sad Endings', 'No Violence', 'No Adult Content',
    'No Subtitles', 'No Old Movies (Pre-2000)', 'No Long Movies (3+ hours)',
    'No Animated Movies', 'No Musicals'
  ];

  const toggleDealBreaker = (dealBreaker) => {
    const newDealBreakers = preferences.dealBreakers.includes(dealBreaker)
      ? preferences.dealBreakers.filter(db => db !== dealBreaker)
      : [...preferences.dealBreakers, dealBreaker];
    
    setPreferences({ ...preferences, dealBreakers: newDealBreakers });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Any deal-breakers?
        </h2>
        <p className="text-white/80 text-center mb-8">
          Select what you'd prefer to avoid (optional)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {dealBreakers.map((dealBreaker) => (
          <button
  key={dealBreaker}
  onClick={() => toggleDealBreaker(dealBreaker)}
  className={`p-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
    preferences.dealBreakers.includes(dealBreaker)
      ? 'bg-red-600 text-white'
      : 'bg-white/20 text-white hover:bg-white/30'
  }`}
>
  <X className={`w-4 h-4 inline mr-2 ${preferences.dealBreakers.includes(dealBreaker) ? 'opacity-100' : 'opacity-50'}`} />
  {dealBreaker}
</button>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <span>Get My Recommendation</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealBreakers;
