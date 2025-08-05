import React, { useState, useEffect } from 'react';
import { ApiClient } from './utils/api.js';
import AuthScreen from './components/AuthScreen.jsx';
import Header from './components/Header.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import GenreSelection from './components/GenreSelection.jsx';
import MoviePreferences from './components/MoviePreferences.jsx';
import ContextSelection from './components/ContextSelection.jsx';
import DealBreakers from './components/DealBreakers.jsx';
import ProcessingScreen from './components/ProcessingScreen.jsx';
import RecommendationScreen from './components/RecommendationScreen.jsx';
import ErrorScreen from './components/ErrorScreen.jsx';
import WatchlistScreen from './components/WatchlistScreen.jsx';
import MovieDetailsScreen from './components/MovieDetailsScreen.jsx';
import ProfileScreen from './components/ProfileScreen.jsx';
import MovieGalleryScreen from './components/MovieGalleryScreen.jsx';

// Initialize API client
const apiClient = new ApiClient();

// Google Auth Hook
const useGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await apiClient.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    window.google?.accounts.id.prompt();
  };

  const handleGoogleResponse = async (response) => {
    try {
      const data = await apiClient.googleAuth(response.credential);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, signInWithGoogle, signOut, handleGoogleResponse };
};

// Main App Component
function App() {
  const { user, loading, signInWithGoogle, signOut, handleGoogleResponse } = useGoogleAuth();
  const [currentStep, setCurrentStep] = useState('welcome');
  const [preferences, setPreferences] = useState({
    genres: [],
    likedMovies: [],
    dislikedMovies: [],
    moods: [],
    socialContext: '',
    dealBreakers: []
  });

  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popularMovies, setPopularMovies] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Initialize Google Auth
  useEffect(() => {
    const initGoogleAuth = () => {
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            prompt_parent_id: 'google-signin'
          });
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    };

    // Clean up function to cancel any outstanding requests
    const cleanup = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };

    if (window.google) {
      initGoogleAuth();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogleAuth;
      document.head.appendChild(script);
    }

    return cleanup;
  }, [handleGoogleResponse]);

  // Fetch popular movies
  const fetchPopularMovies = async (genre = 'all') => {
    setPopularMovies([]);
    setIsLoading(true); 
    try {
      // Ensure genre is a string and properly encoded
      const genreParam = typeof genre === 'string' ? genre : '';
      const movies = await apiClient.getPopularMovies(genreParam);
      setPopularMovies(movies);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  // Save preferences
  const savePreferences = async () => {
    if (!user) return;
    
    try {
      await apiClient.savePreferences(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Get recommendation
  const getRecommendation = async () => {
    if (!user) return;
    setError(null); 
    
    setIsLoading(true);
    try {
      const movie = await apiClient.getRecommendation(preferences);
      setRecommendation(movie);
      setCurrentStep('recommendation');
      
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setError(error.message);
      setCurrentStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Get alternative recommendation (replaces current movie)
  const getAlternativeRecommendation = async () => {
    if (!user) return;
    setError(null);
    
    setIsLoading(true);
    setCurrentStep('processing'); // Show processing screen while getting alternative
    
    try {
      const movie = await apiClient.getAlternativeRecommendation(preferences);
      setRecommendation(movie);
      setCurrentStep('recommendation');
    } catch (error) {
      console.error('Error getting alternative recommendation:', error);
      setError(error.message);
      setCurrentStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle feedback
  const handleFeedback = async (accepted) => {
    if (!user || !recommendation) return;

    try {
      // Check if we've already given feedback for this movie in this session
      if (recommendation.feedbackGiven) {
        console.warn('Feedback already submitted for this movie');
        return;
      }

      await apiClient.submitFeedback({
        movieId: recommendation.tmdbId,
        title: recommendation.title,
        accepted,
        genres: recommendation.genres || []
      });

      // Mark this recommendation as having received feedback
      setRecommendation(prev => ({ ...prev, feedbackGiven: true }));

    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // Reset flow
  const startOver = () => {
    setCurrentStep('welcome');
    setPreferences({
      genres: [],
      likedMovies: [],
      dislikedMovies: [],
      moods: [],
      socialContext: '',
      dealBreakers: []
    });
    setRecommendation(null);
  };

  const sendAgain = () => {
    getRecommendation(preferences);
  };

  const updatePreferences = async () => {
    try {
      await apiClient.updatePreferences(preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // Navigation functions
  const goToGallery = () => {
    setCurrentStep('gallery');
  };

  const goToProfile = () => {
    setCurrentStep('profile');
  };

  const goToWatchlist = () => {
    setCurrentStep('watchlist');
  };

  const goToMovieDetails = (movieId) => {
    setSelectedMovieId(movieId);
    setCurrentStep('movieDetails');
  };

  const goBackFromGallery = () => {
    setCurrentStep('welcome');
  };

  const goBackFromProfile = () => {
    setCurrentStep('welcome');
  };

  const goBackFromWatchlist = () => {
    setCurrentStep('welcome');
  };

  const goBackFromMovieDetails = () => {
    // Check where we came from and go back appropriately
    setCurrentStep('gallery'); // Default to gallery since movies can be accessed from there
    setSelectedMovieId(null);
  };

  const goToMovieDetailsFromProfile = (movieId) => {
    setSelectedMovieId(movieId);
    setCurrentStep('movieDetails');
  };

  const goToMovieDetailsFromGallery = (movieId) => {
    setSelectedMovieId(movieId);
    setCurrentStep('movieDetails');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onSignIn={signInWithGoogle} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header user={user} onSignOut={signOut} onStartOver={startOver} onWatchlistClick={goToWatchlist} onProfileClick={goToProfile} onGalleryClick={goToGallery} />
      
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'welcome' && (
          <WelcomeScreen onNext={() => setCurrentStep('genres')} />
        )}
        
        {currentStep === 'genres' && (
          <GenreSelection
            preferences={preferences}
            setPreferences={setPreferences}
            onNext={(genreQuery) => {
              fetchPopularMovies(genreQuery || 'all');
              setCurrentStep('movies');
            }}
          />
        )}
        
        {currentStep === 'movies' && (
          <MoviePreferences
            movies={popularMovies}
            preferences={preferences}
            setPreferences={setPreferences}
            onNext={() =>{
              updatePreferences(preferences);
            setCurrentStep('context')}
            }
          />
        )}
        
        {currentStep === 'context' && (
          <ContextSelection
            preferences={preferences}
            setPreferences={setPreferences}
            onNext={() => setCurrentStep('dealbreakers')}
          />
        )}
        
        {currentStep === 'dealbreakers' && (
          <DealBreakers
            preferences={preferences}
            setPreferences={setPreferences}
            onNext={async () => {
              setCurrentStep('processing');
              await getRecommendation();
            }}
          />
        )}
        
        {currentStep === 'processing' && (
          <ProcessingScreen />
        )}
        
        {currentStep === 'recommendation' && recommendation && (
          <RecommendationScreen
            movie={recommendation}
            onFeedback={handleFeedback}
            onGetAlternative={getAlternativeRecommendation}
          />
        )}

        {currentStep === 'error' && error && (
          <ErrorScreen
            error={error}
            onStartOver={startOver}
          />
        )}

        {currentStep === 'gallery' && (
          <MovieGalleryScreen
            onBack={goBackFromGallery}
            onMovieClick={goToMovieDetailsFromGallery}
          />
        )}

        {currentStep === 'profile' && (
          <ProfileScreen
            user={user}
            onBack={goBackFromProfile}
            onMovieClick={goToMovieDetailsFromProfile}
          />
        )}

        {currentStep === 'watchlist' && (
          <WatchlistScreen
            onBack={goBackFromWatchlist}
            onMovieClick={goToMovieDetails}
          />
        )}

        {currentStep === 'movieDetails' && selectedMovieId && (
          <MovieDetailsScreen
            movieId={selectedMovieId}
            onBack={goBackFromMovieDetails}
            onFeedback={handleFeedback}
          />
        )}
      </div>
    </div>
  );
}

export default App;