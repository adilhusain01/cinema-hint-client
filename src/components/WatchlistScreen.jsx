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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-white/10"></div>
                <div className="p-4">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          <span className="ml-4 px-3 py-1 bg-purple-600/50 text-white text-sm rounded-full">
            {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''}
          </span>
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
  );
};

export default WatchlistScreen;