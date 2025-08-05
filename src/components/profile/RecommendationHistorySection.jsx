import React from 'react';
import { History, ThumbsUp, ThumbsDown, Clock, Film } from 'lucide-react';

const RecommendationHistorySection = ({ history, onMovieClick }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <History className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No recommendation history yet</h3>
        <p className="text-white/70">Your movie recommendations will appear here as you use the app</p>
      </div>
    );
  }

  const getStatusColor = (accepted) => {
    if (accepted === true) return 'text-green-400 bg-green-500/20';
    if (accepted === false) return 'text-red-400 bg-red-500/20';
    return 'text-gray-400 bg-gray-500/20';
  };

  const getStatusIcon = (accepted) => {
    if (accepted === true) return <ThumbsUp className="w-3 h-3" />;
    if (accepted === false) return <ThumbsDown className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  const getStatusText = (accepted) => {
    if (accepted === true) return 'Accepted';
    if (accepted === false) return 'Rejected';
    return 'Pending';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Recommendation History ({history.length})
        </h3>
      </div>
      
      <div className="space-y-4">
        {history.map((recommendation, index) => (
          <div 
            key={`${recommendation.movieId}-${index}`}
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 
                    className="text-white font-semibold cursor-pointer hover:text-purple-300 transition-colors"
                    onClick={() => recommendation.movieId && onMovieClick(recommendation.movieId)}
                  >
                    {recommendation.title}
                  </h4>
                  <p className="text-white/60 text-sm">
                    Recommended on {new Date(recommendation.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(recommendation.accepted)}`}>
                {getStatusIcon(recommendation.accepted)}
                <span className="text-sm font-medium">
                  {getStatusText(recommendation.accepted)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {history.length > 10 && (
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Showing {Math.min(10, history.length)} of {history.length} recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationHistorySection;