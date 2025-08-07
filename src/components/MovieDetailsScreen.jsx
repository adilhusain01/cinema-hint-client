import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Star, Heart, Trash2, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { ApiClient } from '../utils/api.js';

const MovieDetailsScreen = ({ movieId, onBack, onFeedback }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const apiClient = new ApiClient();

  useEffect(() => {
    fetchMovieDetails();
    checkWatchlistStatus();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      
      // First try to get movie from database
      try {
        const data = await apiClient.getMovieFromDatabase(movieId);
        setMovie(data);
        return;
      } catch (dbError) {
        console.log('Movie not in database, will try to fetch from TMDB:', dbError.message);
      }
      
      // If not in database, try to fetch and save from TMDB
      try {
        const tmdbData = await apiClient.fetchAndSaveMovieFromTMDB(movieId);
        if (tmdbData) {
          setMovie(tmdbData);
        }
      } catch (tmdbError) {
        console.error('Error fetching from TMDB:', tmdbError);
      }
      
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const result = await apiClient.checkWatchlistStatus(movieId);
      setIsInWatchlist(result.isInWatchlist);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const toggleWatchlist = async () => {
    if (watchlistLoading) return;
    
    setWatchlistLoading(true);
    try {
      if (isInWatchlist) {
        await apiClient.removeFromWatchlist(movieId);
        setIsInWatchlist(false);
      } else {
        await apiClient.addToWatchlist({
          tmdbId: movie.tmdbId,
          title: movie.title,
          genres: movie.genres,
          posterPath: movie.posterPath,
          rating: movie.rating || movie.voteAverage,
          year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleFeedback = async (accepted) => {
    try {
      await onFeedback({
        movieId: movie.tmdbId,
        title: movie.title,
        accepted,
        genres: movie.genres
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const platformLinks = [
    {
      name: 'MoviesMod',
      url: 'https://moviesmod.tube',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'YTS',
      url: 'https://en.yts-official.mx',
      color: 'bg-red-600 hover:bg-green-700'
    },
    {
      name: 'IMDb',
      url: `https://www.imdb.com/find?q=${encodeURIComponent(movie?.title || '')}`,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex items-center mb-6">
              <button
                onClick={onBack}
                className="mr-3 p-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="h-6 sm:h-8 bg-white/10 rounded w-48 sm:w-64 animate-pulse"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8">
              <div className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 bg-white/10 rounded-xl animate-pulse flex-shrink-0 mx-auto md:mx-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-6 sm:h-8 bg-white/10 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded w-1/2 mb-6 animate-pulse"></div>
                <div className="h-20 sm:h-24 bg-white/10 rounded mb-6 animate-pulse"></div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="h-10 sm:h-12 bg-white/10 rounded w-full sm:w-32 animate-pulse"></div>
                  <div className="h-10 sm:h-12 bg-white/10 rounded w-full sm:w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
            <div className="flex items-center mb-6">
              <button
                onClick={onBack}
                className="mr-3 p-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Movie Not Found</h1>
            </div>
            <p className="text-white/70 mb-8 text-sm sm:text-base">This movie hasn't been loaded into our database yet.</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
          {movie.backdropPath && (
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-80">
              <img 
                src={movie.backdropPath} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button
                onClick={onBack}
                className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          )}
          
          <div className="p-4 sm:p-6 lg:p-8">
            {!movie.backdropPath && (
              <div className="flex items-center mb-6">
                <button
                  onClick={onBack}
                  className="mr-3 p-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8">
              {movie.posterPath && (
                <div className="flex-shrink-0">
                  <img 
                    src={movie.posterPath} 
                    alt={movie.title}
                    className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 object-cover rounded-xl mx-auto md:mx-0"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white line-clamp-3 flex-1">{movie.title}</h1>
                  <button
                    onClick={toggleWatchlist}
                    disabled={watchlistLoading}
                    className={`p-2.5 sm:p-3 rounded-full transition-all flex-shrink-0 ${
                      isInWatchlist
                        ? 'text-pink-500 hover:text-pink-600 bg-pink-500/20'
                        : 'text-gray-400 hover:text-pink-500 bg-white/10 hover:bg-pink-500/20'
                    } ${watchlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {watchlistLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                    ) : (
                      <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isInWatchlist ? 'fill-current' : ''}`} />
                    )}
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm sm:text-base">
                  {movie.releaseDate && (
                    <span className="text-white/80">
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  )}
                  {movie.runtime && (
                    <span className="flex items-center text-white/80">
                      <Clock className="w-4 h-4 mr-1" />
                      {movie.runtime} min
                    </span>
                  )}
                  <span className="flex items-center text-white/80">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {(movie.rating || movie.voteAverage)?.toFixed(1)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {movie.genres?.map((genre) => (
                    <span 
                      key={genre}
                      className="px-2 sm:px-3 py-1 bg-purple-600/50 text-white text-xs sm:text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                
                <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                  {movie.overview}
                </p>
                
                {movie.director && (
                  <p className="text-white/80 mb-2 text-sm sm:text-base">
                    <strong>Director:</strong> {movie.director}
                  </p>
                )}
                
                {movie.cast?.length > 0 && (
                  <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
                    <strong>Cast:</strong> {movie.cast.join(', ')}
                  </p>
                )}
                
                {/* <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <button
                    onClick={() => handleFeedback(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>I like this</span>
                  </button>
                  
                  <button
                    onClick={() => handleFeedback(false)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Not for me</span>
                  </button>
                  
                  {isInWatchlist && (
                    <button
                      onClick={toggleWatchlist}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Remove from Watchlist</span>
                      <span className="sm:hidden">Remove</span>
                    </button>
                  )}
                </div> */}
                
                <div className="border-t border-white/20 pt-4 sm:pt-6">
                  <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Watch on:</h3>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                    {platformLinks.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${platform.color} text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{platform.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsScreen;