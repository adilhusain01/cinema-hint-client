import { ChevronRight, Users, Shuffle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ApiClient } from '../utils/api';

const moods = [
  { id: 'feel-good', label: 'Feel Good', icon: '😊' },
  { id: 'mind-bending', label: 'Mind-Bending', icon: '🌀' },
  { id: 'thoughtful', label: 'Thoughtful', icon: '🧠' },
  { id: 'exciting', label: 'Exciting', icon: '🔥' },
  { id: 'relaxing', label: 'Relaxing', icon: '😌' },
  { id: 'dark', label: 'Dark & Gritty', icon: '🌑' },
  { id: 'romantic', label: 'Romantic', icon: '💖' },
  { id: 'funny', label: 'Laugh Out Loud', icon: '🤣' }
];

const contexts = [
  { id: 'alone', label: 'Solo Chill', icon: '🧘' },
  { id: 'date', label: 'Date Night', icon: '💋' },
  { id: 'family', label: 'Family Night', icon: '👨‍👩‍👧‍👦' },
  { id: 'friends', label: 'With Friends', icon: '🥳' },
  { id: 'hangover', label: 'Hungover & Fragile', icon: '🤕' },
  { id: 'high', label: 'Feeling... Elevated', icon: '🌬️' },
  { id: 'late-night', label: 'Late Night Vibes', icon: '🌙' },
  { id: 'background', label: 'Just Background Noise', icon: '🔈' }
];

const ContextSelection = ({ preferences = { moods: [], socialContext: null }, setPreferences, onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // console.log('Preferences from ContextSelection', preferences);  

  const toggleMood = (id) => {
    setPreferences(prev => {
      const current = prev.moods || [];
      const updatedMoods = current.includes(id)
        ? current.filter(m => m !== id)
        : [...current, id];
      return { ...prev, moods: updatedMoods };
    });
  };

  const toggleContext = (id) => {
    setPreferences(prev => {
      const newContext = prev.socialContext === id ? null : id;
      return { ...prev, socialContext: newContext };
    });
  };

  const handleContinue = async () => {
    if (!preferences.socialContext || !preferences.moods?.length) {
      // The button is disabled, but this is a good safety check.
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      onNext();
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setError('Failed to save your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-12 min-h-[80vh]">
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 text-center">Set the Mood</h2>
            <p className="text-white/80 mb-6 sm:mb-8 text-center text-sm sm:text-base">What's the vibe you're going for?</p>

            {error && (
              <div className="mb-6 p-3 bg-red-500/20 text-red-200 rounded-lg text-sm sm:text-base max-w-md">
                {error}
              </div>
            )}

            <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-white/90 mb-4 flex items-center text-sm sm:text-base">
                  <Users className="mr-2" size={18} />
                  I'm watching...
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {contexts.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => toggleContext(id)}
                      className={`p-2 sm:p-3 rounded-lg transition-all flex flex-col items-center justify-center h-20 sm:h-24 transform hover:scale-105 ${
                        preferences.socialContext === id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'bg-white/10 text-white/90 hover:bg-white/20'
                      }`}
                      aria-pressed={preferences.socialContext === id}
                    >
                      <span className="text-lg sm:text-2xl mb-1">{icon}</span>
                      <span className="text-xs sm:text-sm text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white/90 mb-4 text-sm sm:text-base">Mood (Can choose multiple 🚬)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {moods.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => toggleMood(id)}
                      className={`p-2 sm:p-3 rounded-lg transition-all flex flex-col items-center justify-center h-20 sm:h-24 transform hover:scale-105 ${
                        preferences.moods?.includes(id)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'bg-white/10 text-white/90 hover:bg-white/20'
                      }`}
                      aria-pressed={preferences.moods?.includes(id)}
                    >
                      <span className="text-lg sm:text-2xl mb-1">{icon}</span>
                      <span className="text-xs sm:text-sm text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 w-full max-w-md">
              {(preferences.moods?.length > 0 || preferences.socialContext) && (
                <div className="text-center mb-4">
                  <p className="text-white/60 text-sm">
                    {preferences.socialContext ? '1 context' : '0 contexts'} • {preferences.moods?.length || 0} mood{preferences.moods?.length === 1 ? '' : 's'} selected
                  </p>
                </div>
              )}
              
              <button
                onClick={handleContinue}
                disabled={!preferences.socialContext || !preferences.moods?.length || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 w-full text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextSelection;