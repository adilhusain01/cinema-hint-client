import React from 'react';
import { Clock } from 'lucide-react';

const ErrorScreen = ({ error, onStartOver }) => {
  const isRateLimit = error?.includes('Daily recommendation limit reached');
  
  // Format remaining time
  const formatTimeRemaining = (timeString) => {
    const resetTime = new Date(timeString);
    const now = new Date();
    const hoursRemaining = Math.ceil((resetTime - now) / (1000 * 60 * 60));
    return hoursRemaining === 1 ? '1 hour' : `${hoursRemaining} hours`;
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12">
        {isRateLimit ? (
          <>
            <Clock className="w-16 h-16 text-purple-500 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Daily Limit Reached
            </h2>
            <p className="text-white/80 text-lg mb-8">
              You've reached your daily movie recommendations limit. Your recommendations will reset in approximately {formatTimeRemaining(error.resetTime)}. Come back then for more personalized suggestions!
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 text-red-500 mx-auto mb-8">❌</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-white/80 text-lg mb-8">
              {error || 'An error occurred while getting your recommendation. Please try again.'}
            </p>
          </>
        )}
        
        <button
          onClick={onStartOver}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg text-white font-semibold"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
