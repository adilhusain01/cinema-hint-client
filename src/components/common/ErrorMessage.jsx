import React from 'react';
import { AlertTriangle, RefreshCcw, Home, X } from 'lucide-react';

const ErrorMessage = ({ 
  error, 
  title = "Something went wrong", 
  onRetry, 
  onDismiss, 
  onGoHome,
  variant = "error" // error, warning, info
}) => {
  const variants = {
    error: {
      container: "bg-red-500/10 border-red-500/30 text-red-100",
      icon: "text-red-400",
      button: "bg-red-600 hover:bg-red-700"
    },
    warning: {
      container: "bg-yellow-500/10 border-yellow-500/30 text-yellow-100", 
      icon: "text-yellow-400",
      button: "bg-yellow-600 hover:bg-yellow-700"
    },
    info: {
      container: "bg-blue-500/10 border-blue-500/30 text-blue-100",
      icon: "text-blue-400", 
      button: "bg-blue-600 hover:bg-blue-700"
    }
  };

  const styles = variants[variant];

  // Parse error message for user-friendly display
  const getFriendlyError = (error) => {
    if (typeof error === 'string') {
      if (error.includes('401') || error.includes('unauthorized')) {
        return "Your session has expired. Please sign in again.";
      }
      if (error.includes('429') || error.includes('rate limit')) {
        return "Too many requests. Please wait a moment and try again.";
      }
      if (error.includes('network') || error.includes('fetch')) {
        return "Network connection error. Please check your internet and try again.";
      }
      if (error.includes('timeout')) {
        return "Request timed out. Please try again.";
      }
      return error;
    }
    return "An unexpected error occurred. Please try again.";
  };

  return (
    <div className={`relative rounded-xl border backdrop-blur-sm p-4 sm:p-6 ${styles.container} shadow-2xl`}>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
      
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>
          <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4 leading-relaxed">
            {getFriendlyError(error)}
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className={`flex items-center justify-center space-x-2 ${styles.button} text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm`}
              >
                <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Try Again</span>
              </button>
            )}
            
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Go Home</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;