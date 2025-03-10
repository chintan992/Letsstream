import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { tmdbAPI, cacheUtils } from '../api/apiService';
import { streamingServices } from '../config/streamingServices';
import FeaturedContentCarousel from './FeaturedContentCarousel';
import Filters from './Filters';
import MediaGrid from './MediaGrid';
import ViewMoreButton from './ViewMoreButton';
import ErrorBoundary from './ErrorBoundary';

function Discover() {
  const [featuredContent, setFeaturedContent] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStreamingService, setActiveStreamingService] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isStreamingLoading, setIsStreamingLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Watchlist handling with proper error handling
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading watchlist:', error);
      return [];
    }
  });

  const handleWatchlistToggle = useCallback((item) => {
    setWatchlist(prev => {
      try {
        const exists = prev.some(i => i.id === item.id);
        const newWatchlist = exists 
          ? prev.filter(i => i.id !== item.id)
          : [...prev, item];
        
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
        toast.success(exists ? 'Removed from watchlist' : 'Added to watchlist');
        return newWatchlist;
      } catch (error) {
        console.error('Error updating watchlist:', error);
        toast.error('Failed to update watchlist');
        return prev;
      }
    });
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    pauseOnHover: true
  };

  const fetchFeaturedContent = useCallback(async () => {
    try {
      const cachedData = cacheUtils.get('featured');
      if (cachedData) {
        setFeaturedContent(cachedData);
        return;
      }

      const featured = await tmdbAPI.getFeaturedContent();
      setFeaturedContent(featured);
      cacheUtils.set('featured', featured);
    } catch (error) {
      console.error('Error fetching featured content:', error);
      setError('Failed to load featured content');
    }
  }, []);

  const fetchFilteredContent = useCallback(async (category, serviceId, pageNum = 1) => {
    if (pageNum === 1) {
      setIsStreamingLoading(true);
    }
    setNoResults(false);
    
    try {
      const data = await tmdbAPI.getFilteredContent(category, serviceId, pageNum);
      
      let combinedResults = [];
      data.forEach(response => {
        if (!response.results) {
          console.error('Invalid API response:', response);
          return;
        }

        const results = response.results.map(item => ({
          ...item,
          media_type: item.media_type || (response.media_type || 'unknown')
        }));
        combinedResults = [...combinedResults, ...results];
      });

      // Remove duplicates
      combinedResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      if (pageNum === 1) {
        setMediaItems(combinedResults);
      } else {
        setMediaItems(prev => [...prev, ...combinedResults]);
      }

      setHasMore(combinedResults.length > 0);
      setNoResults(combinedResults.length === 0);
      
    } catch (error) {
      console.error('Error fetching filtered content:', error);
      setError('An error occurred while fetching content. Please try again.');
      toast.error('Failed to load content');
    } finally {
      if (pageNum === 1) {
        setIsStreamingLoading(false);
      }
    }
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setPage(1);
    setHasMore(true);
    fetchFilteredContent(category, activeStreamingService, 1);
  }, [activeStreamingService, fetchFilteredContent]);

  const handleStreamingServiceClick = useCallback((serviceId) => {
    setPage(1);
    setHasMore(true);
    
    if (activeStreamingService === serviceId) {
      setActiveStreamingService(null);
      fetchFilteredContent(activeCategory, null, 1);
    } else {
      setActiveStreamingService(serviceId);
      fetchFilteredContent(activeCategory, serviceId, 1);
    }
  }, [activeCategory, activeStreamingService, fetchFilteredContent]);

  const handleViewMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      await fetchFilteredContent(activeCategory, activeStreamingService, nextPage);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more items:', error);
      toast.error('Failed to load more items');
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeCategory, activeStreamingService, fetchFilteredContent, isLoadingMore, page]);

  useEffect(() => {
    const initializeData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          fetchFeaturedContent(),
          fetchFilteredContent('all', null, 1)
        ]);
      } catch (error) {
        console.error('Error in initial data fetch:', error);
        setError('Failed to load content. Please try again.');
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeData();
  }, [fetchFeaturedContent, fetchFilteredContent]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-[#000e14]">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-[#000e14] text-gray-900 dark:text-white">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600
              transition-colors duration-200 focus:outline-none focus:ring-2
              focus:ring-primary-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-[#000e14] text-gray-900 dark:text-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {featuredContent && featuredContent.length > 0 && (
            <FeaturedContentCarousel 
              featuredContent={featuredContent} 
              carouselSettings={carouselSettings} 
            />
          )}

          <Filters
            activeCategory={activeCategory}
            handleCategoryChange={handleCategoryChange}
            streamingServices={streamingServices}
            activeStreamingService={activeStreamingService}
            handleStreamingServiceClick={handleStreamingServiceClick}
          />

          <MediaGrid
            mediaItems={mediaItems}
            isStreamingLoading={isStreamingLoading}
            watchlist={watchlist}
            handleWatchlistToggle={handleWatchlistToggle}
            noResults={noResults}
          />

          <ViewMoreButton
            hasMore={hasMore}
            handleViewMore={handleViewMore}
            isLoadingMore={isLoadingMore}
          />

          {noResults && (
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                No results found for the selected filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Discover;
