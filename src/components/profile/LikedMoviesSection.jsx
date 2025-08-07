import React, { useState } from 'react';
import { ThumbsUp, Trash2, ArrowRightLeft } from 'lucide-react';
import { ApiClient } from '../../utils/api.js';

const LikedMoviesSection = ({ likedMovies, onMovieClick, onRefresh }) => {
  const [loading, setLoading] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const apiClient = new ApiClient();

  // Convert Map-based structure to flat array
  const getAllLikedMovies = () => {
    const movies = [];
    Object.entries(likedMovies).forEach(([genre, genreMovies]) => {
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

  const allLikedMovies = getAllLikedMovies();

  // Handle image loading errors
  const handleImageError = (movieId) => {
    setImageErrors(prev => ({ ...prev, [movieId]: true }));
  };

  const removeFromLiked = async (movie) => {
    if (loading[movie.tmdbId]) return;
    
    // console.log('🗑️ Attempting to remove from liked:', movie.title, movie.tmdbId);
    setLoading(prev => ({ ...prev, [movie.tmdbId]: true }));
    try {
      // Remove from preferences by updating with filtered list
      const response = await apiClient.removeFromLikedMovies(movie.tmdbId);
      // console.log('✅ Remove response:', response);
      onRefresh();
    } catch (error) {
      console.error('❌ Error removing from liked movies:', error);
    } finally {
      setLoading(prev => ({ ...prev, [movie.tmdbId]: false }));
    }
  };

  const moveToDisliked = async (movie) => {
    if (loading[movie.tmdbId]) return;
    
    // console.log('🔄 Attempting to move to disliked:', movie.title, movie.tmdbId);
    setLoading(prev => ({ ...prev, [movie.tmdbId]: true }));
    try {
      // First add to disliked
      // console.log('📝 Submitting feedback as disliked...');
      await apiClient.submitFeedback({
        movieId: movie.tmdbId,
        title: movie.title,
        accepted: false,
        genres: movie.genres || []
      });
      
      // Then remove from liked
      // console.log('🗑️ Removing from liked...');
      await apiClient.removeFromLikedMovies(movie.tmdbId);
      // console.log('✅ Successfully moved to disliked');
      onRefresh();
    } catch (error) {
      console.error('❌ Error moving to disliked:', error);
    } finally {
      setLoading(prev => ({ ...prev, [movie.tmdbId]: false }));
    }
  };

  if (allLikedMovies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ThumbsUp className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No liked movies yet</h3>
        <p className="text-white/70">Movies you rate positively will appear here</p>
      </div>
    );
  }

  return (   
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
{allLikedMovies.map((movie) => (
  <div key={movie.tmdbId} className="bg-white/5 rounded-xl overflow-hidden group">
    <div className="relative">
      {movie.posterPath && !imageErrors[movie.tmdbId] ? (
        <img 
          src={movie.posterPath} 
          alt={movie.title}
          className="w-full h-48 sm:h-56 md:h-64 object-cover cursor-pointer"
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
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center cursor-pointer"
              onClick={() => onMovieClick(movie.tmdbId)}>
          <div className="text-center">
            <ThumbsUp className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <p className="text-green-300 text-sm px-2">{movie.title}</p>
          </div>
        </div>
      )}
       <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => moveToDisliked(movie)}
          disabled={loading[movie.tmdbId]}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-red-400 hover:bg-red-500/20 transition-all"
          title="Move to disliked"
        >
          {loading[movie.tmdbId] ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <ArrowRightLeft className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => removeFromLiked(movie)}
          disabled={loading[movie.tmdbId]}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-red-400 hover:bg-red-500/20 transition-all"
          title="Remove from liked"
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
        className="text-white font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-green-300 transition-colors"
        onClick={() => onMovieClick(movie.tmdbId)}
      >
        {movie.title}
      </h4>
      <div className="flex items-center justify-between text-white/60 text-sm mb-2">
        <span className="capitalize">{movie.genre}</span>
        <div className="flex items-center text-green-400">
          <ThumbsUp className="w-3 h-3 mr-1" />
          <span>Liked</span>
        </div>
      </div>
      {movie.genres && movie.genres.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.genres.slice(0, 2).map((genre) => (
            <span 
              key={genre}
              className="px-2 py-1 bg-green-600/30 text-white text-xs rounded-full"
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

export default LikedMoviesSection;