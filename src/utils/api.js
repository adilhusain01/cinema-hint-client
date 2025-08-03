const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

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
      const response = await this.request('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token }),
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

    console.log('Sending recommendation request with:', preferences);
  
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

  // Backup recommendations
  async getBackupRecommendations() {
    return this.request('/movies/backup', {
      method: 'POST'
    });
  }
}