import React, { useEffect } from 'react';
import { Film } from 'lucide-react';

const AuthScreen = ({ onSignIn }) => {
  useEffect(() => {
    // Clean up any existing buttons
    const existingButton = document.getElementById('google-signin');
    if (existingButton) {
      existingButton.innerHTML = '';
    }

    // Initialize Google Sign-In button
    if (window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin'),
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md mx-4">
        <Film className="w-16 h-16 text-white mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Zero-Effort Movie Picker</h1>
        <p className="text-white/80 mb-8">One suggestion. No endless scrolling.</p>
        
        <div 
          id="google-signin"
          className="flex justify-center"
        ></div>
      </div>
    </div>
  );
};

export default AuthScreen;
