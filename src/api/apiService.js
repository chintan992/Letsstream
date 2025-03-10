import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

// Create axios instance with rate limiting
const http = rateLimit(axios.create({
  baseURL: BASE_URL,
}), { maxRequests: 40, perMilliseconds: 1000 }); // 40 requests per second as per TMDB limits

// Add request interceptor for API key
http.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: process.env.REACT_APP_TMDB_API_KEY,
  };
  return config;
});

// Add response interceptor for error handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle rate limit exceeded
      if (error.response.status === 429) {
        console.error('Rate limit exceeded');
        throw new Error('Too many requests. Please try again later.');
      }
      // Handle other API errors
      throw new Error(error.response.data.message || 'An error occurred');
    }
    throw error;
  }
);

// API methods
export const tmdbAPI = {
  getFeaturedContent: async () => {
    const response = await http.get('/trending/all/day');
    return response.data.results.slice(0, 5);
  },

  getFilteredContent: async (category, serviceId, page = 1) => {
    let endpoints = [];
    
    if (serviceId) {
      if (category === 'movies' || category === 'all') {
        endpoints.push(http.get('/discover/movie', {
          params: {
            with_watch_providers: serviceId,
            watch_region: 'US',
            page
          }
        }));
      }
      if (category === 'tv' || category === 'all') {
        endpoints.push(http.get('/discover/tv', {
          params: {
            with_watch_providers: serviceId,
            watch_region: 'US',
            page
          }
        }));
      }
    } else {
      switch (category) {
        case 'movies':
          endpoints.push(http.get('/movie/popular', { params: { page } }));
          break;
        case 'tv':
          endpoints.push(http.get('/tv/popular', { params: { page } }));
          break;
        case 'trending':
        default:
          endpoints.push(http.get('/trending/all/week', { params: { page } }));
      }
    }

    const responses = await Promise.all(endpoints);
    return responses.map(response => response.data);
  },
};

// Cache utilities
export const cacheUtils = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const { data, timestamp } = JSON.parse(item);
      if (Date.now() - timestamp > 5 * 60 * 1000) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }
};