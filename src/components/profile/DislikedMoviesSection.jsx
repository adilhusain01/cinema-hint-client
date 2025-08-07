import React, { useState } from 'react';
import { ThumbsDown, Trash2, ArrowRightLeft } from 'lucide-react';
import { ApiClient } from '../../utils/api.js';

const DislikedMoviesSection = ({ dislikedMovies, onMovieClick, onRefresh }) => {
  const [loading, setLoading] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const apiClient = new ApiClient();

  // Convert Map-based structure to flat array
  const getAllDislikedMovies = () => {
    const movies = [];
    Object.entries(dislikedMovies).forEach(([genre, genreMovies]) => {
      if (Array.isArray(genreMovies)) {
        genreMovies.forEach(movie => {
          // Avoid duplicates by checking if movie already exists
          if (!movies.find(m => m.tmdbId === movie.tmdbId)) {
            movies.push({
              ...movie,
              genre: genre
            });
          }
        });
      }
    });
    return movies;
  };

  const allDislikedMovies = getAllDislikedMovies();

  // Handle image loading errors
  const handleImageError = (movieId) => {
    setImageErrors(prev => ({ ...prev, [movieId]: true }));
  };

  const removeFromDisliked = async (movie) => {
    if (loading[movie.tmdbId]) return;
    
    // console.log('🗑️ Attempting to remove from disliked:', movie.title, movie.tmdbId);
    setLoading(prev => ({ ...prev, [movie.tmdbId]: true }));
    try {
      const response = await apiClient.removeFromDislikedMovies(movie.tmdbId);
      // console.log('✅ Remove from disliked response:', response);
      onRefresh();
    } catch (error) {
      console.error('❌ Error removing from disliked movies:', error);
    } finally {
      setLoading(prev => ({ ...prev, [movie.tmdbId]: false }));
    }
  };

  const moveToLiked = async (movie) => {
    if (loading[movie.tmdbId]) return;
    
    // console.log('🔄 Attempting to move to liked:', movie.title, movie.tmdbId);
    setLoading(prev => ({ ...prev, [movie.tmdbId]: true }));
    try {
      // First add to liked
      // console.log('📝 Submitting feedback as liked...');
      await apiClient.submitFeedback({
        movieId: movie.tmdbId,
        title: movie.title,
        accepted: true,
        genres: movie.genres || []
      });
      
      // Then remove from disliked
      // console.log('🗑️ Removing from disliked...');
      await apiClient.removeFromDislikedMovies(movie.tmdbId);
      // console.log('✅ Successfully moved to liked');
      onRefresh();
    } catch (error) {
      console.error('❌ Error moving to liked:', error);
    } finally {
      setLoading(prev => ({ ...prev, [movie.tmdbId]: false }));
    }
  };

  if (allDislikedMovies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ThumbsDown className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No disliked movies yet</h3>
        <p className="text-white/70">Movies you rate negatively will appear here</p>
      </div>
    );
  }

  return (

      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {allDislikedMovies.map((movie) => (
          <div key={movie.tmdbId} className="bg-white/5 rounded-xl overflow-hidden group">
            <div className="relative">
              {movie.posterPath && !imageErrors[movie.tmdbId] ? (
                <img 
                  src={movie.posterPath} 
                  alt={movie.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover cursor-pointer opacity-75"
                  onClick={() => onMovieClick(movie.tmdbId)}
                  onError={() => handleImageError(movie.tmdbId)}
                  onLoad={() => {
                    // Remove from error state if image loads successfully after an error
                    setImageErrors(prev => {
                      const updated = { ...prev };
                      delete updated[movie.tmdbId];
                      return updated;
                    });
                  }}
                />
              ) : (
                <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center cursor-pointer"
                     onClick={() => onMovieClick(movie.tmdbId)}>
                  <div className="text-center">
                    <ThumbsDown className="w-12 h-12 text-red-400 mx-auto mb-2" />
                    <p className="text-red-300 text-sm px-2">{movie.title}</p>
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-100 transition-opacity">
                <button
                  onClick={() => moveToLiked(movie)}
                  disabled={loading[movie.tmdbId]}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-green-400 hover:bg-green-500/20 transition-all"
                  title="Move to liked"
                >
                  {loading[movie.tmdbId] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <ArrowRightLeft className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => removeFromDisliked(movie)}
                  disabled={loading[movie.tmdbId]}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-red-400 hover:bg-red-500/20 transition-all"
                  title="Remove from disliked"
                >
                  {loading[movie.tmdbId] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 
                className="text-white font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-red-300 transition-colors"
                onClick={() => onMovieClick(movie.tmdbId)}
              >
                {movie.title}
              </h4>
              <div className="flex items-center justify-between text-white/60 text-sm mb-2">
                <span className="capitalize">{movie.genre}</span>
                <div className="flex items-center text-red-400">
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  <span>Disliked</span>
                </div>
              </div>
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {movie.genres.slice(0, 2).map((genre) => (
                    <span 
                      key={genre}
                      className="px-2 py-1 bg-red-600/30 text-white text-xs rounded-full"
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
  );
};

export default DislikedMoviesSection;