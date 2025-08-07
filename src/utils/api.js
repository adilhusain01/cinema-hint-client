// API Base URL with fallback for production
const API_BASE = import.meta.env.VITE_API_BASE || 
  (import.meta.env.PROD ? 'https://api.cinemahint.com/api' : 'http://localhost:3001/api');

// console.log('🔗 API Base URL:', API_BASE);

export class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',  // Add this line
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          const rateLimitError = new Error(error.error);
          rateLimitError.isRateLimit = true;
          rateLimitError.limit = error.limit;
          rateLimitError.current = error.current;
          rateLimitError.resetTime = new Date(error.resetTime);
          throw rateLimitError;
        }
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async googleAuth(token) {
    try {
      // console.log('Sending token to server:', token ? 'Token present' : 'No token');
      // console.log('Token length:', token?.length);
      // console.log('Token preview:', token ? token.substring(0, 100) + '...' : 'N/A');
      
      const requestBody = { 
        token,
        credential: token // Send as both for compatibility
      };
      // console.log('Request body keys:', Object.keys(requestBody));
      
      const response = await this.request('/auth/google', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      return response;
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw error;
    }
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }
  
  // Preference methods
  async getUserPreferences() {
    return this.request('/users/preferences');
  }
  
  async updatePreferences(preferences) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }
  
  async clearPreference(field) {
    return this.request(`/users/preferences/${field}`, {
      method: 'DELETE'
    });
  }

  async getUserHistory() {
    return this.request('/users/history');
  }

  // Movie methods
  async getPopularMovies(genre = 'all') {
    // Ensure genre is a string and encode it for URL
    const genreParam = typeof genre === 'string' ? encodeURIComponent(genre) : '';
    return this.request(`/movies/popular/${genreParam}`);
  }

  // Legacy method - prefer updatePreferences
  async savePreferences(preferences) {
    console.warn('savePreferences is deprecated. Use updatePreferences instead.');
    return this.updatePreferences(preferences);
  }

  async getRecommendation({ genres, moods, socialContext, dealBreakers}) {
    const preferences = {
      genres,
      moods,
      socialContext,
      dealBreakers
    };

    // console.log('Sending recommendation request with:', preferences);
  
    return this.request('/movies/recommend', {
      method: 'POST',
      body: JSON.stringify(preferences)
    });
  }

  // NEW: Get alternative recommendation (reuses the same recommend endpoint)
  async getAlternativeRecommendation({ genres, moods, socialContext, dealBreakers}) {
    const preferences = {
      genres,
      moods,
      socialContext,
      dealBreakers,
      isAlternative: true // Flag to indicate this is an alternative request
    };

    // console.log('Sending alternative recommendation request with:', preferences);
  
    return this.request('/movies/recommend', {
      method: 'POST',
      body: JSON.stringify(preferences)
    });
  }

  async submitFeedback({ movieId, title, accepted, genres, rating = null }) {
    return this.request('/movies/feedback', {
      method: 'POST',
      body: JSON.stringify({
        movieId,
        title,
        accepted,
        ...(genres && { genres }),
        ...(rating !== null && { rating })
      })
    });
  }

  // Additional movie methods
  async searchMovies(query) {
    return this.request(`/movies/search?q=${encodeURIComponent(query)}`);
  }

  async getMovieDetails(movieId) {
    return this.request(`/movies/${movieId}`);
  }

  async getMovieReviews(movieId) {
    return this.request(`/movies/${movieId}/reviews`);
  }

  async addMovieReview(movieId, review) {
    return this.request(`/movies/${movieId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // User preference methods
  async updateUserPreferences({ likedMovies, dislikedMovies }) {

    const preferences = {
      likedMovies,
      dislikedMovies
    };
    
    return this.request('/users/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Health check
  async checkHealth() {
    return this.request('/health');
  }

  // Watchlist methods
  async getWatchlist() {
    return this.request('/users/watchlist');
  }

  async addToWatchlist({ tmdbId, title, genres, posterPath, rating, year }) {
    return this.request('/users/watchlist', {
      method: 'POST',
      body: JSON.stringify({
        tmdbId,
        title,
        genres,
        posterPath,
        rating,
        year
      })
    });
  }

  async removeFromWatchlist(tmdbId) {
    return this.request(`/users/watchlist/${tmdbId}`, {
      method: 'DELETE'
    });
  }

  async checkWatchlistStatus(tmdbId) {
    return this.request(`/users/watchlist/check/${tmdbId}`);
  }

  // Movie details from database
  async getMovieFromDatabase(tmdbId) {
    return this.request(`/movies/database/${tmdbId}`);
  }

  // Get all movies for gallery
  async getAllMovies(page = 1, limit = 50) {
    return this.request(`/movies/gallery?page=${page}&limit=${limit}`);
  }

  // Fetch movie from TMDB and save to database
  async fetchAndSaveMovieFromTMDB(tmdbId) {
    return this.request(`/movies/fetch-tmdb/${tmdbId}`, {
      method: 'POST'
    });
  }

  // Liked/Disliked movie management
  async removeFromLikedMovies(tmdbId) {
    return this.request(`/users/preferences/liked/${tmdbId}`, {
      method: 'DELETE'
    });
  }

  async removeFromDislikedMovies(tmdbId) {
    return this.request(`/users/preferences/disliked/${tmdbId}`, {
      method: 'DELETE'
    });
  }

  // DEPRECATED: Remove backup recommendations as we're now using alternatives
  async getBackupRecommendations() {
    console.warn('getBackupRecommendations is deprecated. Use getAlternativeRecommendation instead.');
    return this.request('/movies/backup', {
      method: 'POST'
    });
  }
}