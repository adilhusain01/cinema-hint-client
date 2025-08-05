import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Film, ArrowLeft } from 'lucide-react';
import { ApiClient } from '../utils/api.js';

const WatchlistScreen = ({ onBack, onMovieClick }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingMovies, setRemovingMovies] = useState({});
  const apiClient = new ApiClient();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (tmdbId) => {
    if (removingMovies[tmdbId]) return;
    
    setRemovingMovies(prev => ({ ...prev, [tmdbId]: true }));
    try {
      await apiClient.removeFromWatchlist(tmdbId);
      setWatchlist(prev => prev.filter(movie => movie.tmdbId !== tmdbId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    } finally {
      setRemovingMovies(prev => ({ ...prev, [tmdbId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[80vh]">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-white/10"></div>
                <div className="p-2 sm:p-3 lg:p-4">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[80vh]">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">My Watchlist</h1>
              <p className="text-xs sm:text-sm text-white/70 mt-1 hidden sm:block">Your saved movies to watch later</p>
            </div>
          </div>
          
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Your watchlist is empty</h2>
            <p className="text-white/70 mb-8">Start adding movies you want to watch by clicking the heart icon on any movie!</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Browse Movies
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[80vh]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={onBack}
              className="mr-3 p-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">My Watchlist</h1>
              <p className="text-xs sm:text-sm text-white/70 mt-1 hidden sm:block">Your saved movies to watch later</p>
            </div>
          </div>
          <span className="ml-3 px-2 sm:px-3 py-1 bg-purple-600/50 text-white text-xs sm:text-sm rounded-full flex-shrink-0">
            {watchlist.length}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {watchlist.map((movie) => (
            <div key={movie.tmdbId} className="bg-white/5 rounded-xl overflow-hidden group hover:scale-105 transition-transform">
              <div className="relative">
                {movie.posterPath && (
                  <img 
                    src={movie.posterPath} 
                    alt={movie.title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover cursor-pointer"
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
              <div className="p-2 sm:p-3 lg:p-4">
                <h3 
                  className="text-white font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-purple-300 transition-colors"
                  onClick={() => onMovieClick(movie.tmdbId)}
                >
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>{movie.year}</span>
                  {movie.rating && (
                    <span className="flex items-center">
                      ⭐ {movie.rating.toFixed(1)}
                    </span>
                  )}
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
      </div>
    </div>
  );
};

export default WatchlistScreen;