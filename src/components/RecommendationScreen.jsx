import React, { useState } from 'react';
import { Clock, Star, Sparkles, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

const RecommendationScreen = ({ movie: rawMovie, backupMovies, onFeedback, onStartOver, onSendAgain }) => {
  const [showBackups, setShowBackups] = useState(false);
  
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
                  onClick={() => onFeedback(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>Perfect!</span>
                </button>
                
                <button
                  onClick={() => {
                    onFeedback(false);
                    setShowBackups(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span>Not for me</span>
                </button>
                
                <button
                  onClick={onStartOver}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Start Over</span>
                </button>

                <button
                  onClick={onSendAgain}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Send Again</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showBackups && backupMovies.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Here are some alternatives:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {backupMovies.map((rawBackupMovie) => {
              const backupMovie = rawBackupMovie?._doc || rawBackupMovie;
              const year = backupMovie?.releaseDate ? 
                new Date(backupMovie.releaseDate).getFullYear() : null;
              
              return (
                <div key={backupMovie.tmdbId} className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
                  {backupMovie.posterPath && (
                    <img 
                      src={backupMovie.posterPath} 
                      alt={backupMovie.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2">{backupMovie.title}</h3>
                    <p className="text-white/60 text-sm mb-3">
                      {year} • ⭐ {(backupMovie.rating || backupMovie.voteAverage)?.toFixed(1)}
                    </p>
                    <p className="text-white/80 text-sm mb-4 line-clamp-3">
                      {rawBackupMovie.reason}
                    </p>
                    <button
                      onClick={() => onFeedback(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                    >
                      Choose This One
                    </button>
                  </div>
                </div>
            )})}
          </div>
          </div>
      )}
    </div>
  );
}

export default RecommendationScreen;
