import React, { useState, useEffect } from 'react';
import { ApiClient } from './utils/api.js';
import { Play, Sparkles, ChevronRight } from 'lucide-react';
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
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

// Initialize API client
const apiClient = new ApiClient();

// Google Auth Hook
const useGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

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
      setAuthError(null); // Clear any previous errors
      const userData = await apiClient.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setAuthError('Session expired. Please sign in again.');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    console.log('Sign in with Google triggered');
    if (window.google?.accounts?.id) {
      console.log('Prompting Google Sign-In...');
      window.google.accounts.id.prompt((notification) => {
        console.log('Google Sign-In prompt result:', notification);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google Sign-In prompt was not displayed or skipped');
          // Fallback: try to render a button inline
          renderGoogleSignInButton();
        }
      });
    } else {
      console.error('Google Sign-In not loaded yet');
      setAuthError('Google Sign-In is not ready. Please refresh the page.');
    }
  };

  const renderGoogleSignInButton = () => {
    console.log('Rendering Google Sign-In button as fallback');
    if (window.google?.accounts?.id) {
      const buttonContainer = document.getElementById('google-signin-button');
      if (buttonContainer) {
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 300
        });
      }
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      console.log('Google response received:', response);
      console.log('Response keys:', Object.keys(response || {}));
      console.log('Credential present:', !!response?.credential);
      setAuthError(null);
      
      if (!response) {
        throw new Error('No response received from Google');
      }
      
      // Try different possible token fields
      const token = response.credential || response.token || response.id_token;
      if (!token) {
        console.error('No token found in response:', response);
        throw new Error('No credential received from Google');
      }
      
      console.log('Using token:', token.substring(0, 50) + '...');
      const data = await apiClient.googleAuth(token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Google auth error:', error);
      setAuthError('Authentication failed. Please try again.');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthError(null);
  };

  // Function to re-verify authentication
  const verifyAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return false;
    }
    
    try {
      const userData = await apiClient.getUserProfile();
      setUser(userData);
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setAuthError('Session expired. Please sign in again.');
      return false;
    }
  };

  return { user, loading, authError, signInWithGoogle, signOut, handleGoogleResponse, verifyAuth };
};

// Main App Component
function App() {
  const { user, loading, authError, signInWithGoogle, signOut, handleGoogleResponse, verifyAuth } = useGoogleAuth();
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
          console.log('Initializing Google Sign-In with client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false
          });
          console.log('Google Sign-In initialized successfully');
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
      console.log('Loading Google Sign-In script...');
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Sign-In script loaded');
        initGoogleAuth();
      };
      script.onerror = (error) => {
        console.error('Failed to load Google Sign-In script:', error);
      };
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

  // Get recommendation with auth verification
  const getRecommendation = async () => {
    // Verify authentication before proceeding
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      setCurrentStep('welcome');
      return;
    }
    
    setError(null); 
    setIsLoading(true);
    try {
      const movie = await apiClient.getRecommendation(preferences);
      setRecommendation(movie);
      setCurrentStep('recommendation');
    } catch (error) {
      console.error('Error getting recommendation:', error);
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        // Session expired, redirect to auth
        await verifyAuth();
        return;
      }
      setError(error.message);
      setCurrentStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Get alternative recommendation (replaces current movie)
  const getAlternativeRecommendation = async () => {
    // Verify authentication before proceeding
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      setCurrentStep('welcome');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    setCurrentStep('processing'); // Show processing screen while getting alternative
    
    try {
      const movie = await apiClient.getAlternativeRecommendation(preferences);
      setRecommendation(movie);
      setCurrentStep('recommendation');
    } catch (error) {
      console.error('Error getting alternative recommendation:', error);
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        // Session expired, redirect to auth
        await verifyAuth();
        return;
      }
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

  // Clear all user selections and reset flow
  const clearSelections = () => {
    setPreferences({
      genres: [],
      likedMovies: [],
      dislikedMovies: [],
      moods: [],
      socialContext: '',
      dealBreakers: []
    });
    setRecommendation(null);
    setError(null);
    setPopularMovies([]);
  };

  // Reset flow
  const startOver = () => {
    setCurrentStep('welcome');
    clearSelections();
  };

  // Handle logo click - go to home and clear selections
  const handleLogoClick = () => {
    setCurrentStep('welcome');
    clearSelections();
  };

  // Enhanced signOut function that clears selections and resets to welcome
  const handleSignOut = () => {
    setCurrentStep('welcome'); // Reset to welcome screen
    clearSelections();
    signOut();
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
    return <LoadingSpinner variant="fullscreen" text="Initializing your movie experience..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden w-full max-w-full">
      <Header 
        user={user} 
        onSignOut={handleSignOut} 
        onStartOver={startOver} 
        onWatchlistClick={goToWatchlist} 
        onProfileClick={goToProfile} 
        onGalleryClick={goToGallery}
        onLogoClick={handleLogoClick}
        onSignIn={signInWithGoogle}
      />
      
      <div className={user ? "container mx-auto max-w-full overflow-x-hidden" : "max-w-full overflow-x-hidden"}>
        {currentStep === 'welcome' && (
          <WelcomeScreen 
            user={user}
            onNext={() => setCurrentStep('genres')}
            onSignIn={signInWithGoogle}
            onSignOut={handleSignOut}
            authError={authError}
            isLoading={loading}
          />
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
            isLoading={isLoading}
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
            onGallery={goToGallery}
          />
        )}

        {currentStep === 'gallery' && (
          <MovieGalleryScreen
            user={user}
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