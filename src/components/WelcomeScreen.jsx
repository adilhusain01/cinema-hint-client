import React, { useState, useEffect } from 'react';
import { ChevronRight, Play, Sparkles, ChevronDown, Star, LogOut } from 'lucide-react';
import LoadingSpinner from './common/LoadingSpinner.jsx';
import logoC from '../assets/logo512.png';

// Unified Welcome/Landing Screen
const WelcomeScreen = ({ 
  user = null, 
  onNext, 
  onSignIn = null, 
  onSignOut = null, 
  authError = null, 
  isLoading = false 
}) => {
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ Data
  const faqData = [
    {
      question: "How does the AI recommendation system work?",
      answer: "Our AI analyzes your genre preferences, movie ratings, viewing context, and feedback to create personalized recommendations. It learns from your choices to get better over time."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use Google OAuth for secure authentication and only store necessary movie preferences. We never share your personal data with third parties."
    },
    {
      question: "How accurate are the recommendations?",
      answer: "Our system continuously improves based on your feedback. The more you use it and rate movies, the more accurate your recommendations become."
    },
    {
      question: "Is the service free?",
      answer: "Yes, our movie recommendation service is completely free to use. Just sign in with Google and start discovering great movies!"
    }
  ];

  const isAuthenticated = !!user;

  const handleSignIn = () => {
    // Simply call the onSignIn prop which should trigger Google Auth
    if (onSignIn) {
      onSignIn();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
            {/* Logo with glow effect */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-2xl opacity-30 scale-150"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center mx-auto">
                <img 
                  src={logoC} 
                  alt="CinemaHint" 
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain border border-gray-700/50 rounded-lg"
                />
              </div>
            </div>

            {isAuthenticated ? (
              /* Authenticated User Welcome */
              <>
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-300 mb-4 sm:mb-6 leading-tight">
                  Welcome back!
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                  Ready to discover your next favorite movie? Let's find something perfect for you.
                </p>
                
                <button
                  onClick={onNext}
                  className="group bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 lg:py-5 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 flex items-center space-x-2 sm:space-x-3 mx-auto text-base sm:text-lg lg:text-xl"
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
                  <span>Find My Movie</span>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              /* Non-authenticated User Landing */
              <>
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                    Movies You
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 font-black">
                      Actually Love
                    </span>
                  </h1>
            
                </div>
              
                {authError && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg max-w-md mx-auto">
                    <p className="text-red-300 text-sm sm:text-base">{authError}</p>
                  </div>
                )}
                
                <button
                  onClick={onSignIn || handleSignIn}
                  disabled={isLoading}
                  className="group bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 sm:py-4 sm:px-8 lg:py-5 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 flex items-center space-x-2 sm:space-x-3 mx-auto text-base sm:text-lg lg:text-xl mb-4 sm:mb-6"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="small" variant="minimal" />
                      <span className="text-sm sm:text-base lg:text-lg">Signing you in...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                      <span>Get Movie</span>
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                {/* Fallback Google Sign-In Button Container */}
                <div id="google-signin-button" className="mx-auto flex justify-center mt-3 sm:mt-4"></div>
                
                <p className="text-gray-500 text-xs sm:text-sm px-4">
                  Free forever • No credit card required • Sign in with Google
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section - Always visible */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">How it works</h2>
            <p className="text-base sm:text-lg text-gray-400">Three simple steps to your perfect movie</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-lg sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">Choose Your Taste</h3>
              <p className="text-gray-400 text-sm sm:text-base px-2">Select genres and rate movies to teach our AI your preferences</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-lg sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">Set The Mood</h3>
              <p className="text-gray-400 text-sm sm:text-base px-2">Tell us your viewing context and any deal-breakers</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-lg sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">Get Your Match</h3>
              <p className="text-gray-400 text-sm sm:text-base px-2">Receive a perfect recommendation with streaming links</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Always visible */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">Questions?</h2>
            <p className="text-base sm:text-lg text-gray-400">Quick answers about CinemaHint</p>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-200 border border-gray-700/30"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-700/20 transition-colors"
                >
                  <h3 className="text-sm sm:text-lg font-medium text-white pr-4">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2024 CinemaHint. Made with ❤️ for movie lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;