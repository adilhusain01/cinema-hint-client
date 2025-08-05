import React, { useState, useEffect } from 'react';
import { Clock, Star, Sparkles, ThumbsUp, ThumbsDown, ExternalLink, X, Heart } from 'lucide-react';
import { ApiClient } from '../utils/api.js';

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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
        {movieData.backdropPath && (
          <div className="relative h-64 md:h-80">
            <img 
              src={movieData.backdropPath} 
              alt={movieData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        )}
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {movieData.posterPath && (
              <div className="flex-shrink-0">
                <img 
                  src={movieData.posterPath} 
                  alt={movieData.title}
                  className="w-48 h-72 object-cover rounded-xl mx-auto md:mx-0"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{movieData.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
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
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movieData.genres?.map((genre) => (
                  <span 
                    key={genre}
                    className="px-3 py-1 bg-purple-600/50 text-white text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                {movieData.overview}
              </p>
              
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  Why this movie?
                </h3>
                <p className="text-white/80">{movieData.reason}</p>
              </div>
              
              {movieData.director && (
                <p className="text-white/80 mb-2">
                  <strong>Director:</strong> {movieData.director}
                </p>
              )}
              
              {movieData.cast?.length > 0 && (
                <p className="text-white/80 mb-6">
                  <strong>Cast:</strong> {movieData.cast.join(', ')}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleThumbsUp}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>Perfect!</span>
                </button>
                
                <button
                  onClick={handleNotForMe}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Getting Alternative...</span>
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="w-5 h-5" />
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
                  } disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2`}
                >
                  {watchlistLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Heart className={`w-5 h-5 ${isInWatchlist ? 'fill-white' : ''}`} />
                      <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Watch "{movieData.title}"</h2>
              <button
                onClick={() => setShowPlatformPopup(false)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {platformLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${platform.color} text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{platform.name}</span>
                </a>
              ))}
            </div>
            
            <button
              onClick={() => setShowPlatformPopup(false)}
              className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationScreen;