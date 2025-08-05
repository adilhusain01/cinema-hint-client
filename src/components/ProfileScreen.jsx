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
      count: Object.values(profileData.likedMovies).reduce((total, movies) => total + movies.length, 0)
    },
    {
      id: 'disliked',
      name: 'Disliked Movies',
      icon: ThumbsDown,
      count: Object.values(profileData.dislikedMovies).reduce((total, movies) => total + movies.length, 0)
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.name}'s Profile</h1>
              <p className="text-white/70">Manage your movie preferences and history</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/20">
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
  );
};

export default ProfileScreen;