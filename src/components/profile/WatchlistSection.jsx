import React, { useState } from 'react';
import { Heart, Trash2, Calendar } from 'lucide-react';
import { ApiClient } from '../../utils/api.js';

const WatchlistSection = ({ watchlist, onMovieClick, onRefresh }) => {
  const [removingMovies, setRemovingMovies] = useState({});
  const apiClient = new ApiClient();

  const removeFromWatchlist = async (tmdbId) => {
    if (removingMovies[tmdbId]) return;
    
    setRemovingMovies(prev => ({ ...prev, [tmdbId]: true }));
    try {
      await apiClient.removeFromWatchlist(tmdbId);
      onRefresh();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    } finally {
      setRemovingMovies(prev => ({ ...prev, [tmdbId]: false }));
    }
  };

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Your watchlist is empty</h3>
        <p className="text-white/70">Movies you save for later will appear here</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Movies to Watch ({watchlist.length})
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {watchlist.map((movie) => (
          <div key={movie.tmdbId} className="bg-white/5 rounded-xl overflow-hidden group hover:scale-105 transition-transform">
            <div className="relative">
              {movie.posterPath && (
                <img 
                  src={movie.posterPath} 
                  alt={movie.title}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => onMovieClick(movie.tmdbId)}
                />
              )}
              <button
                onClick={() => removeFromWatchlist(movie.tmdbId)}
                disabled={removingMovies[movie.tmdbId]}
                className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
              >
                {removingMovies[movie.tmdbId] ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="p-4">
              <h4 
                className="text-white font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-purple-300 transition-colors"
                onClick={() => onMovieClick(movie.tmdbId)}
              >
                {movie.title}
              </h4>
              <div className="flex items-center justify-between text-white/60 text-sm mb-2">
                <span>{movie.year}</span>
                {movie.rating && (
                  <span className="flex items-center">
                    ⭐ {movie.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="flex items-center text-white/50 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Added {new Date(movie.addedAt).toLocaleDateString()}</span>
              </div>
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {movie.genres.slice(0, 2).map((genre) => (
                    <span 
                      key={genre}
                      className="px-2 py-1 bg-purple-600/30 text-white text-xs rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistSection;