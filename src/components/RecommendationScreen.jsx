import React, { useState, useEffect } from 'react';
import { Clock, Star, Sparkles, ThumbsUp, ThumbsDown, ExternalLink, X, Heart } from 'lucide-react';
import { ApiClient } from '../utils/api.js';
import LoadingSpinner from './common/LoadingSpinner.jsx';

const RecommendationScreen = ({ movie: rawMovie, onFeedback, onGetAlternative }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPlatformPopup, setShowPlatformPopup] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  
  const apiClient = new ApiClient();
  
  // Handle both Mongoose document and plain object cases
  const movie = rawMovie?._doc || rawMovie;

  // Ensure we have all required data
  const movieData = {
    ...movie,
    title: movie?.title,
    year: movie?.releaseDate ? new Date(movie.releaseDate).getFullYear() : null,
    runtime: movie?.runtime,
    rating: movie?.rating || movie?.voteAverage,
    genres: movie?.genres || [],
    overview: movie?.overview,
    director: movie?.director,
    cast: movie?.cast || [],
    posterPath: movie?.posterPath,
    backdropPath: movie?.backdropPath,
    reason: rawMovie?.reason, // These come from the AI, not from the database
  };

  const handleNotForMe = async () => {
    setIsLoading(true);
    try {
      // Submit negative feedback first
      await onFeedback(false);
      // Then get an alternative recommendation
      await onGetAlternative();
    } catch (error) {
      console.error('Error getting alternative:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbsUp = async () => {
    // Submit positive feedback
    await onFeedback(true);
    // Show platform popup
    setShowPlatformPopup(true);
  };

  const platformLinks = [
    {
      name: 'IMDb',
      url: `https://www.imdb.com/find?q=${encodeURIComponent(movieData.title)}`,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      name: 'Netflix',
      url: 'https://www.netflix.com/search?q=' + encodeURIComponent(movieData.title),
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'Prime Video',
      url: 'https://www.amazon.com/s?k=' + encodeURIComponent(movieData.title) + '&i=prime-instant-video',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Hulu',
      url: 'https://www.hulu.com/search?q=' + encodeURIComponent(movieData.title),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Disney+',
      url: 'https://www.disneyplus.com/search?q=' + encodeURIComponent(movieData.title),
      color: 'bg-blue-800 hover:bg-blue-900'
    },
    {
      name: 'Apple TV+',
      url: 'https://tv.apple.com/search?term=' + encodeURIComponent(movieData.title),
      color: 'bg-gray-800 hover:bg-gray-900'
    }
  ];

  // Check if movie is in watchlist on component mount
  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (movieData.tmdbId) {
        try {
          const result = await apiClient.checkWatchlistStatus(movieData.tmdbId);
          setIsInWatchlist(result.isInWatchlist);
        } catch (error) {
          console.error('Error checking watchlist status:', error);
        }
      }
    };
    
    checkWatchlistStatus();
  }, [movieData.tmdbId]);

  // Toggle watchlist status
  const toggleWatchlist = async () => {
    if (watchlistLoading) return;
    
    setWatchlistLoading(true);
    try {
      if (isInWatchlist) {
        await apiClient.removeFromWatchlist(movieData.tmdbId);
        setIsInWatchlist(false);
      } else {
        await apiClient.addToWatchlist({
          tmdbId: movieData.tmdbId,
          title: movieData.title,
          genres: movieData.genres,
          posterPath: movieData.posterPath,
          rating: movieData.rating,
          year: movieData.year
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl min-h-[80vh]">
          {movieData.backdropPath && (
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-80">
              <img 
                src={movieData.backdropPath} 
                alt={movieData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
          )}
          
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8">
              {movieData.posterPath && (
                <div className="flex-shrink-0">
                  <img 
                    src={movieData.posterPath} 
                    alt={movieData.title}
                    className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 object-cover rounded-xl mx-auto md:mx-0"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 line-clamp-3">{movieData.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm sm:text-base">
                  <span className="text-white/80">{movieData.year}</span>
                  {movieData.runtime && (
                    <span className="flex items-center text-white/80">
                      <Clock className="w-4 h-4 mr-1" />
                      {movieData.runtime} min
                    </span>
                  )}
                  <span className="flex items-center text-white/80">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {movieData.rating?.toFixed(1)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {movieData.genres?.map((genre) => (
                    <span 
                      key={genre}
                      className="px-2 sm:px-3 py-1 bg-purple-600/50 text-white text-xs sm:text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                
                <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                  {movieData.overview}
                </p>
                
                <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <h3 className="text-white font-semibold mb-2 flex items-center text-sm sm:text-base">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                    Why this movie?
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base">{movieData.reason}</p>
                </div>
                
                {movieData.director && (
                  <p className="text-white/80 mb-2 text-sm sm:text-base">
                    <strong>Director:</strong> {movieData.director}
                  </p>
                )}
                
                {movieData.cast?.length > 0 && (
                  <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
                    <strong>Cast:</strong> {movieData.cast.join(', ')}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <button
                    onClick={handleThumbsUp}
                    className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Perfect!</span>
                  </button>
                  
                  <button
                    onClick={handleNotForMe}
                    disabled={isLoading}
                    className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-600/50 disabled:to-red-700/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="small" variant="minimal" />
                        <span className="hidden sm:inline">Getting Alternative...</span>
                        <span className="sm:hidden">Getting...</span>
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Not for me</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={toggleWatchlist}
                    disabled={watchlistLoading}
                    className={`${
                      isInWatchlist 
                        ? 'bg-pink-600 hover:bg-pink-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base`}
                  >
                    {watchlistLoading ? (
                      <>
                        <LoadingSpinner size="small" variant="minimal" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWatchlist ? 'fill-white' : ''}`} />
                        <span className="hidden sm:inline">{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                        <span className="sm:hidden">{isInWatchlist ? 'Added' : 'Add'}</span>
                      </>
                    )}
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      
        
        {/* Platform Links Popup */}
        {showPlatformPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-3">
              <div className="flex justify-between items-start mb-4 sm:mb-6 gap-2">
                <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-white line-clamp-2 flex-1 min-w-0">Watch "{movieData.title}"</h2>
                <button
                  onClick={() => setShowPlatformPopup(false)}
                  className="text-white/70 hover:text-white p-1 flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {platformLinks.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${platform.color} text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm lg:text-base min-w-0`}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{platform.name}</span>
                  </a>
                ))}
              </div>
              
              <button
                onClick={() => setShowPlatformPopup(false)}
                className="w-full mt-3 sm:mt-4 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendationScreen;