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
      name: 'IMDb',
      url: `https://www.imdb.com/find?q=${encodeURIComponent(movie?.title || '')}`,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      name: 'Netflix',
      url: 'https://www.netflix.com/search?q=' + encodeURIComponent(movie?.title || ''),
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'Prime Video',
      url: 'https://www.amazon.com/s?k=' + encodeURIComponent(movie?.title || '') + '&i=prime-instant-video',
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  if (loading) {
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
            <div className="h-8 bg-white/10 rounded w-64 animate-pulse"></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 h-72 bg-white/10 rounded-xl animate-pulse flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-8 bg-white/10 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded w-1/2 mb-6 animate-pulse"></div>
              <div className="h-24 bg-white/10 rounded mb-6 animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-12 bg-white/10 rounded w-32 animate-pulse"></div>
                <div className="h-12 bg-white/10 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">Movie Not Found</h1>
          </div>
          <p className="text-white/70 mb-8">This movie hasn't been loaded into our database yet.</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
        {movie.backdropPath && (
          <div className="relative h-64 md:h-80">
            <img 
              src={movie.backdropPath} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <button
              onClick={onBack}
              className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
        )}
        
        <div className="p-8">
          {!movie.backdropPath && (
            <div className="flex items-center mb-6">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-8">
            {movie.posterPath && (
              <div className="flex-shrink-0">
                <img 
                  src={movie.posterPath} 
                  alt={movie.title}
                  className="w-48 h-72 object-cover rounded-xl mx-auto md:mx-0"
                />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
                <button
                  onClick={toggleWatchlist}
                  disabled={watchlistLoading}
                  className={`ml-4 p-3 rounded-full transition-all ${
                    isInWatchlist
                      ? 'text-pink-500 hover:text-pink-600 bg-pink-500/20'
                      : 'text-gray-400 hover:text-pink-500 bg-white/10 hover:bg-pink-500/20'
                  } ${watchlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {watchlistLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <Heart className={`w-6 h-6 ${isInWatchlist ? 'fill-current' : ''}`} />
                  )}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
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
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <span 
                    key={genre}
                    className="px-3 py-1 bg-purple-600/50 text-white text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                {movie.overview}
              </p>
              
              {movie.director && (
                <p className="text-white/80 mb-2">
                  <strong>Director:</strong> {movie.director}
                </p>
              )}
              
              {movie.cast?.length > 0 && (
                <p className="text-white/80 mb-6">
                  <strong>Cast:</strong> {movie.cast.join(', ')}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => handleFeedback(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>I like this</span>
                </button>
                
                <button
                  onClick={() => handleFeedback(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span>Not for me</span>
                </button>
                
                {isInWatchlist && (
                  <button
                    onClick={toggleWatchlist}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Remove from Watchlist</span>
                  </button>
                )}
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-white font-semibold mb-4">Watch on:</h3>
                <div className="flex flex-wrap gap-3">
                  {platformLinks.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${platform.color} text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2`}
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
  );
};

export default MovieDetailsScreen;