import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { ApiClient } from '../utils/api';

const GENRES = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary',
  'drama', 'family', 'fantasy', 'history', 'horror', 'music', 'mystery',
  'romance', 'scifi', 'tvmovie', 'thriller', 'war', 'western'
];

const GenreSelection = ({ preferences = { genres: [] }, setPreferences, onNext }) => {
  const apiClient = new ApiClient();

  // console.log('Preferences from GenreSelection', preferences);

  // Helper function to format genre name for display
  const formatLabel = (genre) => {
    // Handle special cases
    if (genre === 'scifi') return 'Sci-Fi';
    if (genre === 'tvmovie') return 'TV Movie';
    return genre.charAt(0).toUpperCase() + genre.slice(1);
  };

  // Helper to get genre ID from name (for API calls)
  const getGenreId = (genreName) => {
    const genreMap = {
      action: 28, adventure: 12, animation: 16, comedy: 35, crime: 80,
      documentary: 99, drama: 18, family: 10751, fantasy: 14, history: 36,
      horror: 27, music: 10402, mystery: 9648, romance: 10749, scifi: 878,
      tvmovie: 10770, thriller: 53, war: 10752, western: 37
    };
    return genreMap[genreName];
  };

  // Helper to get genre name from ID (for backward compatibility)
  const getGenreName = (genreId) => {
    const genreMap = {
      28: 'action', 12: 'adventure', 16: 'animation', 35: 'comedy', 80: 'crime',
      99: 'documentary', 18: 'drama', 10751: 'family', 14: 'fantasy', 36: 'history',
      27: 'horror', 10402: 'music', 9648: 'mystery', 10749: 'romance', 878: 'scifi',
      10770: 'tvmovie', 53: 'thriller', 10752: 'war', 37: 'western'
    };
    return genreMap[genreId] || null;
  };

  const toggleGenre = async (genreName) => {
    const currentGenres = preferences.genres || [];
    const newGenres = currentGenres.includes(genreName)
      ? currentGenres.filter(g => g !== genreName)
      : [...currentGenres, genreName];
  
    // Update local state
    setPreferences(prev => ({
      ...prev,
      genres: newGenres
    }));

  };

  const isGenreSelected = (genreName) => {
    const currentGenres = preferences.genres || [];
    return currentGenres.includes(genreName);
  };

  const handleNext = async () => {
    // Only proceed if we have selected genres
    if (!preferences.genres || preferences.genres.length === 0) return;
    
    try {
      const genreQuery = preferences.genres.join(',');
      
      onNext(genreQuery);
    } catch (error) {
      console.error('Error proceeding to next step:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-12 min-h-[50vh]">
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">Pick Your Genres</h2>
            <p className="text-white/70 text-center mb-8 sm:mb-10 text-sm sm:text-base max-w-2xl">Choose the movie genres you enjoy. Select at least one to continue.</p>
            
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 text-sm sm:text-base font-medium ${
                      isGenreSelected(genre)
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white/10 text-white/90 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {formatLabel(genre)}
                  </button>
                ))}
              </div>

              <div className="text-center space-y-4">
                {preferences.genres?.length > 0 && (
                  <p className="text-white/60 text-sm sm:text-base mb-4">
                    {preferences.genres.length} genre{preferences.genres.length === 1 ? '' : 's'} selected
                  </p>
                )}
                
                <button
                  onClick={handleNext}
                  disabled={preferences.genres?.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto text-sm sm:text-base"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreSelection;
