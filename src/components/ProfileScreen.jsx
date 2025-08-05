import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Heart, ThumbsUp, ThumbsDown, History } from 'lucide-react';
import { ApiClient } from '../utils/api.js';
import WatchlistSection from './profile/WatchlistSection.jsx';
import LikedMoviesSection from './profile/LikedMoviesSection.jsx';
import DislikedMoviesSection from './profile/DislikedMoviesSection.jsx';
import RecommendationHistorySection from './profile/RecommendationHistorySection.jsx';

const ProfileScreen = ({ user, onBack, onMovieClick }) => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [profileData, setProfileData] = useState({
    watchlist: [],
    likedMovies: {},
    dislikedMovies: {},
    recommendationHistory: []
  });
  const [loading, setLoading] = useState(true);
  const apiClient = new ApiClient();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [watchlist, preferences, history] = await Promise.all([
        apiClient.getWatchlist(),
        apiClient.getUserPreferences(),
        apiClient.getUserHistory()
      ]);

      setProfileData({
        watchlist,
        likedMovies: preferences.likedMovies || {},
        dislikedMovies: preferences.dislikedMovies || {},
        recommendationHistory: history
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchProfileData();
  };

  // Helper functions to get deduplicated counts (matching component logic)
  const getLikedMoviesCount = () => {
    const movies = [];
    Object.entries(profileData.likedMovies).forEach(([genre, genreMovies]) => {
      if (Array.isArray(genreMovies)) {
        genreMovies.forEach(movie => {
          if (!movies.find(m => m.tmdbId === movie.tmdbId)) {
            movies.push(movie);
          }
        });
      }
    });
    return movies.length;
  };

  const getDislikedMoviesCount = () => {
    const movies = [];
    Object.entries(profileData.dislikedMovies).forEach(([genre, genreMovies]) => {
      if (Array.isArray(genreMovies)) {
        genreMovies.forEach(movie => {
          if (!movies.find(m => m.tmdbId === movie.tmdbId)) {
            movies.push(movie);
          }
        });
      }
    });
    return movies.length;
  };

  const tabs = [
    {
      id: 'watchlist',
      name: 'Watchlist',
      icon: Heart,
      count: profileData.watchlist.length
    },
    {
      id: 'liked',
      name: 'Liked Movies',
      icon: ThumbsUp,
      count: getLikedMoviesCount()
    },
    {
      id: 'disliked',
      name: 'Disliked Movies',
      icon: ThumbsDown,
      count: getDislikedMoviesCount()
    },
    {
      id: 'history',
      name: 'Recommendation History',
      icon: History,
      count: profileData.recommendationHistory.length
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[80vh]">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
          </div>
          
          <div className="flex gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/10 rounded w-32 animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-white/10"></div>
                <div className="p-4">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[80vh]">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="mr-3 p-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-white truncate">{user.name}</h1>
              <p className="text-xs sm:text-sm text-white/70 mt-1 hidden sm:block">Manage your movie preferences and history</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 border-b border-white/20">
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="flex overflow-x-auto scrollbar-hide gap-1 pb-1 sm:hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center min-w-0 flex-shrink-0 px-3 py-2 rounded-t-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white border-b-2 border-purple-400'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-xs font-medium">{tab.name.split(' ')[0]}</span>
                  {tab.count > 0 && (
                    <span className="bg-purple-600/70 text-white text-xs px-1.5 py-0.5 rounded-full mt-1 min-w-[18px] text-center">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Desktop: Normal flex layout */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white border-b-2 border-purple-400'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                  {tab.count > 0 && (
                    <span className="bg-purple-600/50 text-white text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'watchlist' && (
            <WatchlistSection
              watchlist={profileData.watchlist}
              onMovieClick={onMovieClick}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'liked' && (
            <LikedMoviesSection
              likedMovies={profileData.likedMovies}
              onMovieClick={onMovieClick}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'disliked' && (
            <DislikedMoviesSection
              dislikedMovies={profileData.dislikedMovies}
              onMovieClick={onMovieClick}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'history' && (
            <RecommendationHistorySection
              history={profileData.recommendationHistory}
              onMovieClick={onMovieClick}
              onRefresh={refreshData}
            />
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;