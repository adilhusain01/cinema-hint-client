import React from 'react';
import { RefreshCw } from 'lucide-react';
import ErrorMessage from './common/ErrorMessage.jsx';

const ErrorScreen = ({ error, onStartOver, onGallery }) => {
  const isRateLimit = error?.includes('Daily recommendation limit reached');
  

  if (isRateLimit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-700/50">
      
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Daily Limit Reached
          </h2>
          
          <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            You've reached your daily movie recommendations limit. Your recommendations will reset in approximately{' '}
            <span className="text-yellow-400 font-semibold">
              24 hours
            </span>. 
            Come back then for more personalized suggestions!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={onGallery}
              className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              <span>Visit Gallery Instead</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <ErrorMessage
          error={error}
          title="Recommendation Failed"
          onRetry={onStartOver}
          onGoHome={onStartOver}
          variant="error"
        />
      </div>
    </div>
  );
};

export default ErrorScreen;
