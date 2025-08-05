import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage.jsx';

const AuthScreen = ({ onSignIn, authError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);

  // Handle Google Response
  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    try {
      // Call the parent's handleGoogleResponse function directly
      await onSignIn(response);
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Auth for the landing page
  useEffect(() => {
    const initGoogleAuth = () => {
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          setGoogleInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    };

    if (window.google) {
      initGoogleAuth();
    } else {
      // Load Google Script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogleAuth;
      document.head.appendChild(script);
    }
  }, []);

  const handleSignIn = () => {
    if (googleInitialized && window.google?.accounts?.id) {
      setIsLoading(true);
      try {
        // Try the prompt first
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If prompt fails, render the button as fallback
            setIsLoading(false);
            renderGoogleButton();
          } else {
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error showing Google Sign-In prompt:', error);
        setIsLoading(false);
        // Fallback to button
        renderGoogleButton();
      }
    } else {
      console.error('Google Sign-In not initialized');
    }
  };

  const renderGoogleButton = () => {
    // Clean up any existing button
    const existingButton = document.getElementById('google-signin-fallback');
    if (existingButton) {
      existingButton.innerHTML = '';
    }

    // Create container if it doesn't exist
    let container = document.getElementById('google-signin-fallback');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google-signin-fallback';
      container.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
      container.innerHTML = `
        <div class="bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-md mx-auto w-full">
          <h3 class="text-white text-lg sm:text-xl font-semibold mb-4 text-center">Sign in to CinemaHint</h3>
          <div id="google-button-container" class="flex justify-center mb-4"></div>
          <button onclick="this.closest('#google-signin-fallback').remove()" class="w-full text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
        </div>
      `;
      document.body.appendChild(container);
    }

    // Render Google button in the container
    if (window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(
        document.getElementById('google-button-container'),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center',
          width: 250
        }
      );
    }
  };

  return (
    <LandingPage 
      onSignIn={handleSignIn} 
      authError={authError}
      isLoading={isLoading}
    />
  );
};

export default AuthScreen;
