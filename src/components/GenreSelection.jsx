import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { ApiClient } from '../utils/api';

const GENRES = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary',
  'drama', 'family', 'fantasy', 'history', 'horror', 'music', 'mystery',
  'romance', 'scifi', 'tvmovie', 'thriller', 'war', 'western'
];

const GenreSelection = ({ preferences, setPreferences, onNext }) => {
  const apiClient = new ApiClient();

  console.log('Preferences from GenreSelection', preferences);
  
  // useEffect(() => {
  //   const loadPreferences = async () => {
  //     try {
  //       const savedPrefs = await apiClient.getUserPreferences();
  //       // Ensure we have an array of genre names
  //       let savedGenres = [];
        
  //       if (savedPrefs.preferredGenres) {
  //         savedGenres = savedPrefs.preferredGenres;
  //       } else if (savedPrefs.genres) {
  //         // Convert any numeric IDs to genre names if needed
  //         savedGenres = savedPrefs.genres.map(genre => 
  //           typeof genre === 'number' ? getGenreName(genre) : genre
  //         ).filter(Boolean);
  //       }
        
  //       if (savedGenres.length > 0) {
  //         setPreferences(prev => ({
  //           ...prev,
  //           genres: savedGenres
  //         }));
  //       }
  //     } catch (error) {
  //       console.error('Failed to load preferences:', error);
  //     }
  //   };
    
  //   loadPreferences();
  // }, [setPreferences]);

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

    console.log('Updated genres:', newGenres);
    
    // // Save to backend
    // try {
    //   await apiClient.updatePreferences({ 
    //     genres: newGenres,
    //     // Include genre IDs for backward compatibility
    //     genreIds: newGenres.map(getGenreId).filter(Boolean)
    //   });
    // } catch (error) {
    //   console.error('Failed to save genre preferences:', error);
    //   // Revert on error
    //   setPreferences(prev => ({
    //     ...prev,
    //     genres: currentGenres
    //   }));
    // }
  };

  const isGenreSelected = (genreName) => {
    const currentGenres = preferences.genres || [];
    return currentGenres.includes(genreName);
  };

  const handleNext = async () => {
    // Only proceed if we have selected genres
    if (preferences.genres.length === 0) return;
    
    try {
      const genreQuery = preferences.genres.join(',');
      
      onNext(genreQuery);
    } catch (error) {
      console.error('Error proceeding to next step:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <h2 className="text-3xl font-bold text-white mb-2">Pick Your Genres</h2>
        <p className="text-white/80 mb-8">Select at least 3 genres you enjoy</p>
        
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`p-4 rounded-lg transition-all ${
                  isGenreSelected(genre)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                {formatLabel(genre)}
              </button>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div>
              <button
                onClick={handleNext}
                disabled={preferences.genres.length === 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreSelection;
