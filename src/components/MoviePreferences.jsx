import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, ChevronRight, Film, Heart } from 'lucide-react';
import { ApiClient } from '../utils/api.js';
import LoadingSpinner from './common/LoadingSpinner.jsx';

// Loading Skeleton Component
const MovieSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-8">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="bg-white/5 rounded-xl overflow-hidden animate-pulse">
        <div className="w-full h-48 sm:h-56 md:h-64 bg-white/10"></div>
        <div className="p-3 sm:p-4">
          <div className="h-4 sm:h-6 bg-white/10 rounded w-3/4 mb-2 sm:mb-3"></div>
          <div className="h-3 sm:h-4 bg-white/10 rounded w-1/2 mb-3 sm:mb-4"></div>
          <div className="flex space-x-2">
            <div className="flex-1 h-8 sm:h-10 bg-white/10 rounded-lg"></div>
            <div className="flex-1 h-8 sm:h-10 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MoviePreferences = ({ movies = [], preferences = { likedMovies: [], dislikedMovies: [] }, setPreferences, onNext, isLoading = false }) => {
  const [watchlistStatus, setWatchlistStatus] = useState({});
  const [watchlistLoading, setWatchlistLoading] = useState({});
  const apiClient = new ApiClient();

  // console.log(movies);
  console.log('Preferences from MoviePreferences', preferences);
  
  const handleMovieRating = (movie, liked) => {
    const newPreferences = { ...preferences };
    
    // Prepare the movie data with all available information
    const movieData = {
      tmdbId: movie.tmdbId || movie.id || null,
      title: movie.title || null,
      rating: movie.rating || movie.voteAverage || null,
      genres: movie.genres || [],
      posterPath: movie.poster_path || movie.posterPath,
      backdropPath: movie.backdrop_path || movie.backdropPath,
      overview: movie.overview,
      releaseDate: movie.release_date || movie.releaseDate,
      year: movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : null)
    };
    
    if (liked) {
      // Add to likedMovies, remove from dislikedMovies if present
      newPreferences.likedMovies = [
        ...newPreferences.likedMovies.filter(m => m.tmdbId !== movieData.tmdbId), 
        movieData
      ];
      newPreferences.dislikedMovies = newPreferences.dislikedMovies.filter(m => m.tmdbId !== movieData.tmdbId);
    } else {
      // Add to dislikedMovies, remove from likedMovies if present
      // Don't include rating for disliked movies
      const { rating, ...dislikedMovie } = movieData;
      newPreferences.dislikedMovies = [
        ...newPreferences.dislikedMovies.filter(m => m.tmdbId !== movieData.tmdbId), 
        dislikedMovie
      ];
      newPreferences.likedMovies = newPreferences.likedMovies.filter(m => m.tmdbId !== movieData.tmdbId);
    }
    
    setPreferences(newPreferences);
  };

  const isLiked = (movieId) => preferences.likedMovies.some(m => m.tmdbId === movieId);
  const isDisliked = (movieId) => preferences.dislikedMovies.some(m => m.tmdbId === movieId);

  // Check watchlist status for all movies
  useEffect(() => {
    const checkWatchlistStatuses = async () => {
      const statuses = {};
      for (const movie of movies) {
        try {
          const result = await apiClient.checkWatchlistStatus(movie.tmdbId);
          statuses[movie.tmdbId] = result.isInWatchlist;
        } catch (error) {
          console.error('Error checking watchlist status:', error);
          statuses[movie.tmdbId] = false;
        }
      }
      setWatchlistStatus(statuses);
    };

    if (movies.length > 0) {
      checkWatchlistStatuses();
    }
  }, [movies]);

  // Toggle watchlist status
  const toggleWatchlist = async (movie) => {
    const movieId = movie.tmdbId;
    if (watchlistLoading[movieId]) return;
    
    setWatchlistLoading(prev => ({ ...prev, [movieId]: true }));
    try {
      if (watchlistStatus[movieId]) {
        await apiClient.removeFromWatchlist(movieId);
        setWatchlistStatus(prev => ({ ...prev, [movieId]: false }));
      } else {
        await apiClient.addToWatchlist({
          tmdbId: movieId,
          title: movie.title,
          genres: movie.genres,
          posterPath: movie.posterPath,
          rating: movie.rating,
          year: movie.year
        });
        setWatchlistStatus(prev => ({ ...prev, [movieId]: true }));
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setWatchlistLoading(prev => ({ ...prev, [movieId]: false }));
    }
  };

  // Show loading state if loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-12 min-h-[80vh]">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
              Finding popular movies...
            </h2>
            <p className="text-white/80 text-center mb-6 sm:mb-8 text-sm sm:text-base">
              Loading a great selection for you to rate
            </p>
            <MovieSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // If no movies are available yet
  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 min-h-[80vh] flex flex-col justify-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Film className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">Preparing your movie selection</h2>
            <p className="text-white/70 mb-6 text-sm sm:text-base">Just rate from these and we'll proceed further to curate your perfect movie match</p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-700/50 shadow-2xl min-h-[80vh]">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 text-center">
            Rate these popular movies
          </h2>
          <p className="text-white/60 text-center mb-6 sm:mb-8 text-sm sm:text-base px-4">
          Yayyy or Nayyy — Rate your past watches from these (if any)
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-8">
            {movies.map((movie) => (
              <div key={movie.tmdbId} className="bg-gray-800/30 hover:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10">
                {movie.posterPath && (
                  <img 
                    src={movie.posterPath} 
                    alt={movie.title}
                    className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover"
                  />
                )}
                <div className="p-2 sm:p-3 lg:p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold line-clamp-2 flex-1 text-xs sm:text-sm lg:text-base">{movie.title}</h3>
                    <button
                      onClick={() => toggleWatchlist(movie)}
                      disabled={watchlistLoading[movie.tmdbId]}
                      className={`ml-1 sm:ml-2 p-1 rounded-full transition-all flex-shrink-0 ${
                        watchlistStatus[movie.tmdbId]
                          ? 'text-pink-500 hover:text-pink-600'
                          : 'text-gray-400 hover:text-pink-500'
                      } ${watchlistLoading[movie.tmdbId] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {watchlistLoading[movie.tmdbId] ? (
                        <LoadingSpinner size="small" variant="minimal" />
                      ) : (
                        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${watchlistStatus[movie.tmdbId] ? 'fill-current' : ''}`} />
                      )}
                    </button>
                  </div>
                  <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4">
                    {movie.year} • ⭐ {movie.rating?.toFixed(1)}
                  </p>
                  
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleMovieRating(movie, true)}
                      className={`group flex-1 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                        isLiked(movie.tmdbId)
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30'
                          : 'bg-gray-700/50 text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/30 border border-gray-600/50 hover:border-green-500/50'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 sm:w-4 sm:h-4 mx-auto transition-transform duration-200 ${isLiked(movie.tmdbId) ? '' : 'group-hover:rotate-12'}`} />
                    </button>
                    <button
                      onClick={() => handleMovieRating(movie, false)}
                      className={`group flex-1 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                        isDisliked(movie.tmdbId)
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                          : 'bg-gray-700/50 text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/30 border border-gray-600/50 hover:border-red-500/50'
                      }`}
                    >
                      <ThumbsDown className={`w-3 h-3 sm:w-4 sm:h-4 mx-auto transition-transform duration-200 ${isDisliked(movie.tmdbId) ? '' : 'group-hover:rotate-12'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={onNext}
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 flex items-center space-x-2 mx-auto text-sm sm:text-base"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePreferences;
