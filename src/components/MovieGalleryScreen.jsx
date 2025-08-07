import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Star, Clock, Search, Film } from 'lucide-react';
import { ApiClient } from '../utils/api.js';

const MovieGalleryScreen = ({ onBack, onMovieClick, user = null }) => {
  const isAuthenticated = !!user;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlistStatus, setWatchlistStatus] = useState({});
  const [watchlistLoading, setWatchlistLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const apiClient = new ApiClient();

  useEffect(() => {
    fetchMovies();
  }, []);

  // Re-fetch watchlist statuses when user auth state changes
  useEffect(() => {
    if (isAuthenticated && movies.length > 0) {
      checkWatchlistStatuses(movies);
    } else if (!isAuthenticated) {
      // Clear watchlist status for non-authenticated users
      setWatchlistStatus({});
    }
  }, [isAuthenticated, movies.length]);

  useEffect(() => {
    // Filter movies based on search query
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAllMovies();
      setMovies(data);
      setFilteredMovies(data);
      
      // Check watchlist status for all movies (only if authenticated)
      if (isAuthenticated) {
        await checkWatchlistStatuses(data);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatuses = async (movieList) => {
    const statuses = {};
    for (const movie of movieList.slice(0, 20)) { // Check first 20 to avoid too many requests
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
          rating: movie.rating || movie.voteAverage,
          year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null
        });
        setWatchlistStatus(prev => ({ ...prev, [movieId]: true }));
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setWatchlistLoading(prev => ({ ...prev, [movieId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[80vh]">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
          </div>
          
          <div className="h-12 bg-white/10 rounded w-96 mb-8 animate-pulse"></div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(20)].map((_, i) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={onBack}
              className="mr-3 p-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Film className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-white truncate">Gallery</h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1 hidden sm:block">Movies our users got recommended with</p>
              </div>
            </div>
          </div>
          
          <div className="text-white/60 text-xs sm:text-sm ml-3 flex-shrink-0">
            {filteredMovies.length}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search movies by title or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {searchQuery ? 'No movies found' : 'No movies in gallery yet'}
            </h3>
            <p className="text-white/70">
              {searchQuery 
                ? `No movies match "${searchQuery}". Try a different search term.`
                : 'Movies will appear here as they get discovered through recommendations.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie.tmdbId} className="bg-white/5 rounded-xl overflow-hidden group hover:scale-105 transition-transform">
                <div className="relative">
                  {movie.posterPath ? (
                    <img 
                      src={movie.posterPath} 
                      alt={movie.title}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover cursor-pointer"
                      onClick={() => onMovieClick(movie.tmdbId)}
                    />
                  ) : (
                    <div 
                      className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center cursor-pointer"
                      onClick={() => onMovieClick(movie.tmdbId)}
                    >
                      <Film className="w-12 h-12 text-indigo-400" />
                    </div>
                  )}
                  {/* Watchlist button - only for authenticated users */}
                  {isAuthenticated && (
                    <button
                      onClick={() => toggleWatchlist(movie)}
                      disabled={watchlistLoading[movie.tmdbId]}
                      className={`absolute top-2 right-2 p-2 backdrop-blur-sm rounded-full transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 ${
                        watchlistStatus[movie.tmdbId]
                          ? 'bg-pink-500/50 text-pink-100 hover:text-pink-200'
                          : 'bg-black/50 text-white/80 hover:text-pink-400 hover:bg-pink-500/20'
                      } ${watchlistLoading[movie.tmdbId] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {watchlistLoading[movie.tmdbId] ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Heart className={`w-4 h-4 ${watchlistStatus[movie.tmdbId] ? 'fill-current' : ''}`} />
                      )}
                    </button>
                  )}
                </div>
                <div className="p-2 sm:p-3 lg:p-4">
                  <h3 
                    className="text-white font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-purple-300 transition-colors"
                    onClick={() => onMovieClick(movie.tmdbId)}
                  >
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between text-white/60 text-sm mb-2">
                    <span>
                      {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                    </span>
                    {(movie.rating || movie.voteAverage) && (
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        <span>{(movie.rating || movie.voteAverage).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((genre) => (
                        <span 
                          key={genre}
                          className="px-2 py-1 bg-indigo-600/30 text-white text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                      {movie.genres.length > 2 && (
                        <span className="px-2 py-1 bg-gray-600/30 text-white text-xs rounded-full">
                          +{movie.genres.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default MovieGalleryScreen;