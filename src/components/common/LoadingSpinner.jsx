import React from 'react';
import { Film, Loader } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', variant = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = {
    small: 'p-2',
    medium: 'p-3 sm:p-4',
    large: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-12'
  };

  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-red-500 to-purple-600 p-3 sm:p-4 rounded-full">
              <Film className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-bounce" />
            </div>
          </div>
          <div className="mt-4 sm:mt-6 space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-white">{text}</h3>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader className={`${sizeClasses[size]} animate-spin text-red-500`} />
        {text && <span className="text-white/80 text-xs sm:text-sm">{text}</span>}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full border-2 border-gray-600 border-t-red-500 w-5 h-5 sm:w-6 sm:h-6"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className={`relative ${sizeClasses[size]} bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center`}>
          <Film className={`${size === 'small' ? 'w-2 h-2' : size === 'medium' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-8 h-8'} text-white animate-pulse`} />
        </div>
      </div>
      {text && (
        <p className="mt-2 sm:mt-3 text-white/80 text-xs sm:text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;