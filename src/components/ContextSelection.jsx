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

const ContextSelection = ({ preferences, setPreferences, onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = new ApiClient();

  console.log('Preferences from ContextSelection', preferences);

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
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <h2 className="text-3xl font-bold text-white mb-2">Set the Mood</h2>
        <p className="text-white/80 mb-8">What's the vibe you're going for?</p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="w-full max-w-2xl space-y-8">
          <div>
            <h3 className="text-white/90 mb-4 flex items-center">
              <Users className="mr-2" size={20} />
              I'm watching...
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {contexts.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => toggleContext(id)}
                  className={`p-3 rounded-lg transition-all flex flex-col items-center justify-center h-24 ${
                    preferences.socialContext === id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/90 hover:bg-white/20'
                  }`}
                  aria-pressed={preferences.socialContext === id}
                >
                  <span className="text-2xl mb-1">{icon}</span>
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white/90 mb-4">Mood</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {moods.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => toggleMood(id)}
                  className={`p-3 rounded-lg transition-all flex flex-col items-center justify-center h-24 ${
                    preferences.moods?.includes(id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/90 hover:bg-white/20'
                  }`}
                  aria-pressed={preferences.moods?.includes(id)}
                >
                  <span className="text-2xl mb-1">{icon}</span>
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={handleContinue}
            disabled={!preferences.socialContext || !preferences.moods?.length || isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextSelection;