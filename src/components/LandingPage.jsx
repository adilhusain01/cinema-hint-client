import React, { useState } from 'react';
import { Film, Sparkles, Heart, Users, Zap, ChevronDown, ChevronRight, Star, Play } from 'lucide-react';
import LoadingSpinner from './common/LoadingSpinner.jsx';

const LandingPage = ({ onSignIn, authError, isLoading = false }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-red-500" />,
      title: "AI-Powered Recommendations",
      description: "Our advanced AI analyzes your preferences to suggest perfect movie matches just for you."
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Personal Watchlist",
      description: "Save movies you want to watch later and keep track of your favorites."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Social Context Aware",
      description: "Get recommendations based on whether you're watching alone, with friends, or family."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Instant Discovery",
      description: "Find your next favorite movie in seconds with our streamlined recommendation process."
    }
  ];

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
      question: "Can I find where to watch recommended movies?",
      answer: "Yes! We provide direct links to popular streaming platforms like Netflix, Prime Video, Hulu, Disney+, and more."
    },
    {
      question: "Is the service free?",
      answer: "Yes, our movie recommendation service is completely free to use. Just sign in with Google and start discovering great movies!"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      comment: "Found my new favorite movies! The AI really understands my taste."
    },
    {
      name: "Alex R.",
      rating: 5,
      comment: "Perfect for date nights. Context-aware recommendations are spot on!"
    },
    {
      name: "Mike T.",
      rating: 5,
      comment: "Saves me hours of scrolling through streaming services. Love it!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8 text-white">
      {/* Landing Page Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-b border-red-500/20 shadow-2xl">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-red-600 to-red-700 p-2 sm:p-3 rounded-xl">
                  <Play className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                  CinemaHint
                </h1>
                <p className="text-xs text-gray-400 -mt-1 hidden sm:block">
                  AI-Powered Movie Discovery
                </p>
              </div>
            </div>
            
            {/* Sign In Button */}
            <button
              onClick={onSignIn}
              disabled={isLoading}
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" variant="minimal" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </header>
      {/* Hero Section - Welcome Screen Style */}
      <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="max-w-5xl mx-auto text-center px-2 sm:px-4 lg:px-6">
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 border border-gray-700/50 shadow-2xl">
            {/* Icon with glow effect */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-2xl opacity-30 scale-150"></div>
              <div className="relative bg-gradient-to-r from-red-600 to-red-700 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-300 mb-4 sm:mb-6 leading-tight">
              CinemaHint
            </h1>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-300 mb-4 sm:mb-6">
              AI-Powered Movie Discovery
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Skip the endless scrolling. Get personalized movie recommendations in seconds with our intelligent AI that learns your taste.
            </p>
            
            {authError && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg max-w-md mx-auto">
                <p className="text-red-300 text-sm sm:text-base">{authError}</p>
              </div>
            )}
            
            <button
              onClick={onSignIn}
              disabled={isLoading}
              className="group bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 flex items-center space-x-2 sm:space-x-3 mx-auto text-lg sm:text-xl mb-4 sm:mb-6"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" variant="minimal" />
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Start Finding Movies</span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-gray-500 text-sm">
              Free forever • No credit card required • Sign in with Google
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">How it works</h2>
            <p className="text-base sm:text-lg text-gray-400">Three simple steps to your perfect movie</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">Choose Your Taste</h3>
              <p className="text-sm sm:text-base text-gray-400">Select genres and rate movies to teach our AI your preferences</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">Set The Mood</h3>
              <p className="text-sm sm:text-base text-gray-400">Tell us your viewing context and any deal-breakers</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">Get Your Match</h3>
              <p className="text-sm sm:text-base text-gray-400">Receive a perfect recommendation with streaming links</p>
            </div>
          </div>
        </div>
      </div>


      {/* FAQ Section - Simplified */}
      <div className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">Questions?</h2>
            <p className="text-base sm:text-lg text-gray-400">Quick answers about CinemaHint</p>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {faqData.slice(0, 4).map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-200 border border-gray-700/30"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-700/20 transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-medium text-white pr-2">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 MovieRecommendor. Made with ❤️ for movie lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;