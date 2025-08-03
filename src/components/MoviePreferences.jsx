import React from 'react';
import { ThumbsUp, ThumbsDown, ChevronRight, Film } from 'lucide-react';

// Loading Skeleton Component
const MovieSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-white/5 rounded-xl overflow-hidden animate-pulse">
        <div className="w-full h-64 bg-white/10"></div>
        <div className="p-4">
          <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
          <div className="flex space-x-2">
            <div className="flex-1 h-10 bg-white/10 rounded-lg"></div>
            <div className="flex-1 h-10 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MoviePreferences = ({ movies = [], preferences, setPreferences, onNext, isLoading = false }) => {

  // console.log(movies);
  console.log('Preferences from MoviePreferences', preferences);
  
  const handleMovieRating = (movie, liked) => {
    const newPreferences = { ...preferences };
    
    // Prepare the movie data with all available information
    const movieData = {
      tmdbId: movie.tmdbId || movie.id || null,
      title: movie.title || null,
      rating: movie.rating || null,
      genres: movie.genres || [],
      posterPath: movie.poster_path || movie.posterPath,
      year: movie.year ||  null
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

  // Show loading state if loading
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Finding popular movies...
          </h2>
          <p className="text-white/80 text-center mb-8">
            Loading a great selection for you to rate
          </p>
          <MovieSkeleton />
        </div>
      </div>
    );
  }

  // If no movies are available yet
  if (movies.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center p-12 bg-white/10 backdrop-blur-lg rounded-2xl">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Film className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Preparing your movie selection</h2>
        <p className="text-white/70 mb-6">We're finding the perfect movies to match your taste.</p>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Rate these popular movies
        </h2>
        <p className="text-white/60 text-center mb-8 text-sm">
          We'll use your ratings to find your perfect movie match
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {movies.map((movie) => (
            <div key={movie.tmdbId} className="bg-white/5 rounded-xl overflow-hidden">
              {movie.posterPath && (
                <img 
                  src={movie.posterPath} 
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{movie.title}</h3>
                <p className="text-white/60 text-sm mb-4">
                  {movie.year} • ⭐ {movie.rating?.toFixed(1)}
                </p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMovieRating(movie, true)}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                      isLiked(movie.tmdbId)
                        ? 'bg-green-600 text-white'
                        : 'bg-white/20 text-white hover:bg-green-600/50'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleMovieRating(movie, false)}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                      isDisliked(movie.tmdbId)
                        ? 'bg-red-600 text-white'
                        : 'bg-white/20 text-white hover:bg-red-600/50'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviePreferences;
