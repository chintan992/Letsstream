import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { useUserFeatures } from '../hooks/useUserFeatures';
import { getRecommendations } from '../api/tmdbApi';
import { getStoredVideoSource, setStoredVideoSource, saveTVProgress, getTVProgress } from '../utils/storage';
import VideoSection from './VideoSection';
import { useAuth } from '../context/AuthContext';
import SourceSelector from './SourceSelector';
import fetchEpisodes from '../utils/fetchEpisodes';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './ErrorBoundaryWatchPage';
import EpisodeNavigation from './EpisodeNavigation';
import QuickActions from './QuickActions';
import UseBrave from './UseBrave';

// Lazy load components that are not immediately needed
const ContentTabs = lazy(() => import('./ContentTabs'));
const Recommendations = lazy(() => import('./Recommendations'));
const EpisodeGrid = lazy(() => import('./EpisodeGrid'));
const UserListsSidebar = lazy(() => import('./UserListsSidebar'));

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

const lightModeStyles = {
  containerBg: 'bg-gray-50',
  textColor: 'text-gray-900',
  cardBg: 'bg-white',
  cardBorder: 'border border-gray-200',
  buttonBg: 'bg-blue-500 hover:bg-blue-600',
  buttonText: 'text-white',
  titleColor: 'text-gray-800',
  secondaryText: 'text-gray-600',
  tertiaryText: 'text-gray-500'
};

const WatchPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();
  const videoSectionRef = useRef(null);
  const [showUserLists, setShowUserLists] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [detailedOverview, setDetailedOverview] = useState('');
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]); // new state for seasons list
  const [mediaData, setMediaData] = useState({
    type: type === 'movie' ? 'movie' : 'series',
    seriesId: type === 'tv' ? id : '',
    episodeNo: type === 'tv' ? '1' : '',
    season: type === 'tv' ? '1' : '0', // default season to '0' temporarily
    movieId: type === 'movie' ? id : '',
  });
  const iframeRef = useRef(null);
  const [videoSource, setVideoSource] = useState(() => getStoredVideoSource() || 'multiembed');
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const contentRef = useRef(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [episodeLayout, setEpisodeLayout] = useState('list'); // 'list' or 'grid'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDistractFree, setIsDistractFree] = useState(false);

  const buttonClasses = {
    base: `flex items-center gap-1.5 sm:gap-2 xs:gap-1 p-3 sm:p-4 xs:p-2 rounded-full shadow-lg transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02c39a] relative z-[60]`,
    default: `bg-[#02c39a] text-white hover:bg-[#00a896] transform hover:scale-105
      hover:shadow-xl active:scale-95`,
    active: `bg-[#c3022b] text-white hover:bg-[#a80016]`
  };

  const handleSourceChange = (source) => {
    setVideoSource(source);
    setStoredVideoSource(source);
    setIsVideoReady(false);
    setTimeout(() => setIsVideoReady(true), 100);
  };

  useEffect(() => {
    const savedSource = getStoredVideoSource();
    if (savedSource) {
      setVideoSource(savedSource);
    }
  }, []);

  useEffect(() => {
    let savedProgress = null;

    const fetchSeasonsAndSetProgress = async () => {
      if (type === 'tv' && id) {
        try {
          savedProgress = getTVProgress(id);

          const tvResponse = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
          const tvData = await tvResponse.json();

          if (savedProgress) {
            setMediaData(prev => ({
              ...prev,
              season: savedProgress.season,
              episodeNo: savedProgress.episode
            }));
          } else if (tvData.seasons?.length > 0) {
            setMediaData(prev => ({
              ...prev,
              season: tvData.seasons[0].season_number.toString()
            }));
          }

          setSeasons(tvData.seasons || []); // Store seasons data
          setIsVideoReady(true);
        } catch (error) {
          console.error('Error fetching seasons:', error);
        }
      }
    };

    fetchSeasonsAndSetProgress();
  }, [type, id]);

  const {
    watchlist,
    favorites,
    watchHistory,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatchHistory
  } = useUserFeatures();

  const isInWatchlist = watchlist?.some(i => i.id === Number(id));
  const isInFavorites = favorites?.some(i => i.id === Number(id));

  useEffect(() => {
    const fetchDetailsAndRecommendations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.media_type = type;
        setItem(data);

        const detailsResponse = await fetch(
          `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=keywords,reviews,translations`
        );
        const detailsData = await detailsResponse.json();

        let fullOverview = data.overview || '';

        const englishTranslation = detailsData.translations?.translations?.find(
          t => t.iso_639_1 === 'en'
        );

        if (englishTranslation?.data?.overview) {
          fullOverview = englishTranslation.data.overview;
        }

        if (detailsData.keywords?.keywords || detailsData.keywords?.results) {
          const keywords = detailsData.keywords?.keywords || detailsData.keywords?.results || [];
          if (keywords.length > 0) {
            fullOverview += '\n\nTopics: ' + keywords.map(k => k.name).join(', ');
          }
        }

        if (detailsData.reviews?.results?.length > 0) {
          const topReview = detailsData.reviews.results.find(r => r.content.length > 100);
          if (topReview) {
            fullOverview += '\n\nCritic Review:\n"' + topReview.content.slice(0, 500) +
              (topReview.content.length > 500 ? '..."' : '"') +
              `\n- ${topReview.author}`;
          }
        }

        setDetailedOverview(fullOverview);

        setMediaData(prevData => ({
          ...prevData,
          seriesId: type === 'tv' ? id : '',
          movieId: type === 'movie' ? id : '',
        }));

        const recommendationsData = await getRecommendations(type, id);
        setRecommendations(recommendationsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (type && id) {
      fetchDetailsAndRecommendations();
    }
  }, [id, type]);


  useEffect(() => {
    fetchEpisodes(type, id, mediaData, setMediaData, setEpisodes, setIsVideoReady, BASE_URL, API_KEY);
  }, [type, id, mediaData]);

  const fetchSeasonEpisodes = async (seasonValue) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/${id}/season/${seasonValue}?api_key=${API_KEY}`);
      const data = await response.json();
      setEpisodes(data.episodes || []);
      if (data.episodes?.[0]) {
        setCurrentEpisode(data.episodes[0]);
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const handleWatchlistToggle = async () => {
    if (isInWatchlist) {
      await removeFromWatchlist(item);
    } else {
      await addToWatchlist({...item, media_type: type});
    }
  };

  const handleFavoritesToggle = async () => {
    if (isInFavorites) {
      await removeFromFavorites(item);
    } else {
      await addToFavorites({...item, media_type: type});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVideoReady(true);
    if (item) {
      addToWatchHistory({...item, media_type: type});
      if (type === 'tv') {
        saveTVProgress(id, mediaData.season, mediaData.episodeNo);
      }
    }
  };

  const handleListItemClick = async (item) => {
    setShowUserLists(false);

    try {
      if (!currentUser) return;

      const historyItem = {
        id: item.id,
        title: item.title || item.name,
        media_type: item.media_type,
        poster_path: item.poster_path,
        overview: item.overview
      };

      if (item.media_type === 'tv') {
        const episodeInfo = {
          season: '1',
          episode: '1',
          name: item.name
        };
        await addToWatchHistory({...historyItem}, episodeInfo);
      } else {
        await addToWatchHistory({...historyItem});
      }

      console.log('Added to watch history from recommendations');
    } catch (error) {
      console.error('Error adding to watch history:', error);
    }

    navigate(`/watch/${item.media_type}/${item.id}`);

    if (item.id === Number(id)) {
      window.location.reload();
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setMediaData(prev => ({
      ...prev,
      [name]: value
    }));

    setIsVideoReady(false);

    if (name === 'episodeNo') {
      const episode = episodes.find(ep => ep.episode_number.toString() === value);
      setCurrentEpisode(episode);
    }

    if (name === 'season') {
      setMediaData(prev => ({
        ...prev,
        episodeNo: '1'
      }));

      fetchSeasonEpisodes(value);
    }

    if (type === 'tv') {
      saveTVProgress(id,
        name === 'season' ? value : mediaData.season,
        name === 'episodeNo' ? value : mediaData.episodeNo
      );
    }

    if (item) {
      addToWatchHistory({
        ...item,
        media_type: type,
        season: name === 'season' ? value : mediaData.season,
        episode: name === 'episodeNo' ? value : mediaData.episodeNo
      });
    }

    setTimeout(() => setIsVideoReady(true), 100);
  };

  useEffect(() => {
    if (episodes.length > 0 && mediaData.episodeNo) {
      const episode = episodes.find(ep => ep.episode_number.toString() === mediaData.episodeNo);
      setCurrentEpisode(episode);
    }
  }, [episodes, mediaData.episodeNo]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowQuickActions(scrollPosition > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!type || !id) return;

      try {
        const creditsResponse = await fetch(
          `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsResponse.json();
        setCast(creditsData.cast?.slice(0, 20) || []);
        setCrew(creditsData.crew?.slice(0, 20) || []);

        const reviewsResponse = await fetch(
          `${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}`
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.results || []);

        const similarResponse = await fetch(
          `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`
        );
        const similarData = await similarResponse.json();
        const similarWithType = similarData.results?.slice(0, 12).map(item => ({
          ...item,
          media_type: type
        })) || [];
        setSimilar(similarWithType);
      } catch (error) {
        console.error('Error fetching additional data:', error);
      }
    };

    fetchAdditionalData();
  }, [type, id]);

  // Add fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Add intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, []);

  const handleOrientationChange = () => {
    setIsVideoReady(false);
    setTimeout(() => setIsVideoReady(true), 100);
  };

  useEffect(() => {
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a1118]' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-[1920px] animate-pulse">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
            <div className="xl:col-span-2 space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-800/40 rounded-lg"></div>
              <div className="aspect-video bg-gray-300 dark:bg-gray-800/60 rounded-lg"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-800/40 rounded-lg"></div>
            </div>
            <div className="hidden xl:block">
              <div className="h-96 bg-gray-200 dark:bg-gray-800/40 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-[#0a1118]' : 'bg-gray-50'}`}>
        <div className="bg-white dark:bg-[#1a2634] rounded-xl shadow-lg dark:shadow-black/50 p-8 max-w-md w-full mx-4 
          transform transition-all hover:scale-105 border border-gray-100/10 backdrop-blur-sm">
          <div className="text-center">
            <div className="bg-red-100/10 dark:bg-red-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 
              backdrop-blur-sm border border-red-500/20">
              <svg className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto animate-pulse" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#02c39a] to-[#00a896] dark:from-[#00edb8] dark:to-[#00c39a] 
                text-white rounded-lg hover:from-[#00a896] hover:to-[#019485] dark:hover:from-[#00c39a] dark:hover:to-[#00a896] 
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02c39a] 
                dark:focus:ring-[#00edb8] transform hover:-translate-y-0.5 shadow-lg dark:shadow-black/50"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`min-h-screen relative ${isDarkMode ? 'bg-[#0a1118] text-gray-100' : `${lightModeStyles.containerBg} ${lightModeStyles.textColor}`}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {/* Main Content */}
      <div className="relative z-10 px-2 sm:px-4 md:px-6 lg:px-8">
        <ErrorBoundary>
          <UseBrave />
          <motion.div 
            ref={contentRef} 
            className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 max-w-[1920px]"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-8">
              {/* Main content column */}
              <div className={`${isDistractFree ? 'w-full' : 'lg:w-2/3'} flex flex-col space-y-4`}>
                {/* Title and tagline */}
                <AnimatePresence>
                  {!isDistractFree && (
                    <motion.div 
                      initial={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-4 mb-6"
                    >
                      <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white/90' : lightModeStyles.titleColor}`}>
                        {item?.title || item?.name}
                        <span className={`ml-3 text-lg sm:text-xl md:text-2xl font-normal ${isDarkMode ? 'text-white/60' : lightModeStyles.secondaryText}`}>
                          {item?.release_date?.slice(0, 4) || item?.first_air_date?.slice(0, 4)}
                          {item?.vote_average && (
                            <span className="ml-3">
                              <span className="text-yellow-500">★</span>{' '}
                              {item.vote_average.toFixed(1)}
                            </span>
                          )}
                        </span>
                      </h1>
                      {item?.tagline && (
                        <p className={`text-lg sm:text-xl italic ${isDarkMode ? 'text-white/70' : lightModeStyles.tertiaryText}`}>
                          {item.tagline}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video Player */}
                <motion.div 
                  className={`relative rounded-lg overflow-hidden bg-[#000000] shadow-md sm:shadow-xl dark:shadow-black/50 w-full ${isFullscreen ? 'fixed inset-0 z-[100]' : ''}`}
                  variants={itemVariants}
                  layoutId="videoPlayer"
                >
                  {isVideoReady ? (
                    <VideoSection
                      ref={videoSectionRef}
                      mediaData={{ ...mediaData, apiType: videoSource }}
                      isVideoReady={isVideoReady}
                      onSubmit={handleSubmit}
                      iframeRef={iframeRef}
                      allowFullscreen={true}
                      onSourceChange={handleSourceChange}
                    />
                  ) : (
                    <motion.div 
                      className="relative rounded-lg overflow-hidden bg-[#000000] shadow-md sm:shadow-xl 
                        dark:shadow-black/50 aspect-video flex items-center justify-center"
                      animate={{ opacity: [0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <motion.div 
                        className="rounded-full h-8 w-8 sm:h-12 sm:w-12 border-3 sm:border-4 
                          border-[#02c39a] border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Source selector and controls */}
                <motion.div 
                  className="mb-2 sm:mb-4 relative z-[70]"
                  variants={itemVariants}
                >
                  <div className={`flex flex-wrap items-center justify-between gap-2 sm:gap-3 ${
                    isDarkMode ? 'bg-black/40 backdrop-blur-sm' : 'bg-white shadow-md'
                  } rounded-lg p-2 sm:p-3 ${
                    isDarkMode ? 'border border-white/10' : 'border border-gray-200'
                  }`}>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <div className="w-full sm:w-auto min-w-[120px]">
                        <SourceSelector
                          videoSource={videoSource}
                          handleSourceChange={handleSourceChange}
                          showSourceMenu={showSourceMenu}
                          setShowSourceMenu={setShowSourceMenu}
                        />
                      </div>
<div className="flex items-center gap-2 w-full sm:w-auto">
  <button
    onClick={() => setIsDistractFree(prev => !prev)}
    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg 
      transition-colors text-sm sm:text-base active:scale-95 transform hover:scale-105
      ${isDistractFree ? 
        'bg-[#02c39a] text-white hover:bg-[#00a896]' : 
        'bg-white/5 text-white/60 hover:text-white/90'}`}
    aria-label={isDistractFree ? "Exit distraction-free mode" : "Enter distraction-free mode"}
  >
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d={isDistractFree ?
          "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z" :
          "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"} 
      />
    </svg>
    <span className="hidden sm:inline">
      {isDistractFree ? "Exit Focus" : "Focus Mode"}
    </span>
  </button>
</div>
                    </div>
                  </div>
                </motion.div>

                {/* Episode navigation for TV shows */}
                <Suspense fallback={<div className="h-40 bg-gray-800/40 animate-pulse rounded-lg" />}>
                  {type === 'tv' && (
                    <motion.div 
                      className="space-y-3 sm:space-y-4"
                      variants={itemVariants}
                    >
                      <motion.div 
                        className="flex items-center justify-between gap-3 px-2"
                        layout
                      >
                        <h3 className="text-base sm:text-lg font-medium text-white/90">Episodes</h3>
                        <div className="flex items-center gap-3">
                          <AnimatePresence mode="wait">
                            {episodeLayout === 'list' && (
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-2 sm:gap-3 bg-black/20 rounded-lg px-2 sm:px-3 py-2"
                              >
                                <span className="text-sm sm:text-base text-white/60">Season:</span>
                                <select
                                  value={mediaData.season}
                                  onChange={(e) => handleInputChange({
                                    target: { name: 'season', value: e.target.value }
                                  })}
                                  className="bg-transparent text-white/90 text-sm sm:text-base font-medium 
                                    outline-none cursor-pointer hover:text-[#02c39a] transition-colors
                                    py-1.5 px-2 sm:px-3 rounded-md touch-manipulation min-h-[40px]"
                                >
                                  {seasons.map((season) => (
                                    <option 
                                      key={season.season_number}
                                      value={season.season_number}
                                      className="bg-[#1a2634] text-white py-2"
                                    >
                                      {season.season_number}
                                    </option>
                                  ))}
                                </select>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1.5">
                            <button
                              onClick={() => setEpisodeLayout('list')}
                              className={`p-2.5 sm:p-3 rounded-md transition-all duration-200 touch-manipulation
                                ${episodeLayout === 'list'
                                  ? 'bg-[#02c39a] text-white'
                                  : 'text-white/60 hover:text-white/90'
                                }`}
                              aria-label="List view"
                            >
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setEpisodeLayout('grid')}
                              className={`p-2.5 sm:p-3 rounded-md transition-all duration-200 touch-manipulation
                                ${episodeLayout === 'grid'
                                  ? 'bg-[#02c39a] text-white'
                                  : 'text-white/60 hover:text-white/90'
                                }`}
                              aria-label="Grid view"
                            >
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="w-full overflow-hidden bg-white/5 dark:bg-gray-800/40 backdrop-blur-sm 
                          rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/60 
                          transition-colors duration-200"
                        layout
                        variants={itemVariants}
                      >
                        <AnimatePresence mode="wait">
                          {episodeLayout === 'list' ? (
                            <motion.div
                              key="list"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="min-w-0 sm:min-w-[300px] p-1.5 sm:p-2"
                            >
                              <EpisodeNavigation
                                episodes={episodes}
                                currentEpisodeNo={mediaData.episodeNo}
                                currentEpisode={currentEpisode}
                                season={mediaData.season}
                                onEpisodeChange={(newEpisodeNo) => handleInputChange({
                                  target: { name: 'episodeNo', value: newEpisodeNo.toString() }
                                })}
                                isDarkMode={isDarkMode}
                                isLoading={!isVideoReady}
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="grid"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="min-w-[300px] p-1.5 sm:p-2"
                            >
                              <EpisodeGrid
                                type={type}
                                mediaData={mediaData}
                                episodes={episodes}
                                seasons={seasons}
                                currentEpisode={currentEpisode}
                                handleInputChange={handleInputChange}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  )}
                </Suspense>

                {/* Content tabs */}
                <AnimatePresence>
                  {!isDistractFree && (
                    <Suspense fallback={<div className="h-96 bg-gray-800/40 animate-pulse rounded-lg" />}>
                      {item && (
                        <motion.div
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          variants={itemVariants}
                          className={`mt-3 sm:mt-6 ${isDarkMode ? 'bg-white dark:bg-[#1a2634]' : `${lightModeStyles.cardBg} ${lightModeStyles.cardBorder}`} rounded-lg sm:rounded-xl 
                            shadow-md sm:shadow-lg dark:shadow-black/50 p-3 sm:p-6`}
                        >
                          <ContentTabs
                            item={item}
                            detailedOverview={detailedOverview}
                            showFullOverview={showFullOverview}
                            setShowFullOverview={setShowFullOverview}
                            cast={cast}
                            crew={crew}
                            reviews={reviews}
                            similar={similar}
                            handleListItemClick={handleListItemClick}
                          />
                        </motion.div>
                      )}
                    </Suspense>
                  )}
                </AnimatePresence>
              </div>

              {/* Recommendations column */}
              <AnimatePresence>
                {!isDistractFree && (
                  <motion.div 
                    initial={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="lg:w-1/3"
                  >
                    <Suspense fallback={<div className="h-96 bg-gray-800/40 animate-pulse rounded-lg" />}>
                      <motion.div 
                        className="sticky top-6 space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {/* Desktop Recommendations */}
                        <div className="hidden lg:block">
                          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-lg">
                            <div className="p-4 border-b border-white/10">
                              <h2 className="text-xl font-semibold text-white/90">Recommended For You</h2>
                            </div>
                            <div className="p-4">
                              <Recommendations
                                recommendations={recommendations}
                                handleListItemClick={handleListItemClick}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Mobile Recommendations */}
                        <div className="block lg:hidden">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                              <h2 className="text-xl font-semibold text-white/90">Recommended For You</h2>
                            </div>
                            <div className="relative group">
                              <motion.div 
                                className="overflow-x-auto overflow-y-hidden scrollbar-none scroll-smooth snap-x snap-mandatory"
                                id="mobile-recommendations-scroll"
                              >
                                <motion.div 
                                  className="inline-flex gap-3 px-4 pb-4"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ staggerChildren: 0.1 }}
                                >
                                  {recommendations.map((item, index) => (
                                    <motion.div
                                      key={item.id}
                                      className="group relative flex-none w-[160px] flex flex-col gap-2 cursor-pointer snap-start"
                                      onClick={() => handleListItemClick(item)}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                        <img
                                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                                          alt={item.title || item.name}
                                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                          loading="lazy"
                                          onError={(e) => { e.target.src = '/fallback-poster.jpg' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                          <div className="absolute bottom-0 left-0 right-0 p-2">
                                            <p className="text-xs text-white/90 text-center line-clamp-2">
                                              {item.overview?.slice(0, 50)}...
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <motion.h3 
                                        className="text-sm font-medium text-center text-white/80 line-clamp-1 group-hover:text-[#02c39a] transition-colors"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                      >
                                        {item.title || item.name}
                                      </motion.h3>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </motion.div>

                              {/* Scroll Buttons */}
                              <button
                                onClick={() => {
                                  const container = document.getElementById('mobile-recommendations-scroll');
                                  container.scrollBy({ left: -200, behavior: 'smooth' });
                                }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm p-2 rounded-r-lg 
                                  text-white/80 hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100
                                  disabled:opacity-0 touch-manipulation"
                                aria-label="Scroll left"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>

                              <button
                                onClick={() => {
                                  const container = document.getElementById('mobile-recommendations-scroll');
                                  container.scrollBy({ left: 200, behavior: 'smooth' });
                                }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm p-2 rounded-l-lg 
                                  text-white/80 hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100
                                  disabled:opacity-0 touch-manipulation"
                                aria-label="Scroll right"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick actions */}
            <AnimatePresence>
              {showQuickActions && !isDistractFree && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-0 left-0 right-0 z-[60] p-3 sm:p-6 bg-gradient-to-t from-[#0a1118] to-transparent"
                >
                  <QuickActions
                    isInWatchlist={isInWatchlist}
                    isInFavorites={isInFavorites}
                    handleWatchlistToggle={handleWatchlistToggle}
                    handleFavoritesToggle={handleFavoritesToggle}
                    showQuickActions={showQuickActions}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* User lists button */}
            <AnimatePresence>
              {!isDistractFree && (
                <div className="fixed bottom-4 sm:bottom-6 left-2 sm:left-6 z-[60] flex flex-col gap-2">
                  <motion.button
                    onClick={() => setShowUserLists(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${buttonClasses.base} ${showUserLists
                      ? 'bg-[#c3022b] text-white hover:bg-[#a80016] dark:bg-[#ff0336] dark:hover:bg-[#d4002d]'
                      : isDarkMode ? 'bg-[#02c39a] text-white hover:bg-[#00a896] dark:bg-[#00edb8] dark:hover:bg-[#00c39a]'
                        : `${lightModeStyles.buttonBg} ${lightModeStyles.buttonText}` } group relative xs:text-sm text-base sm:text-lg md:text-xl backdrop-blur-sm shadow-lg dark:shadow-black/50 w-full sm:w-auto`}
                    aria-label="Open user lists"
                  >
                    <div className="relative flex items-center justify-center">
                      <motion.svg
                        animate={{ rotate: showUserLists ? 90 : 0 }}
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16" 
                        />
                      </motion.svg>
                      <span className="hidden sm:inline ml-2 whitespace-nowrap">
                        My Lists
                      </span>
                    </div>
                  </motion.button>
                </div>
              )}
            </AnimatePresence>

            {/* User lists overlay */}
            <AnimatePresence>
              {showUserLists && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[65]"
                  onClick={() => setShowUserLists(false)}
                />
              )}
            </AnimatePresence>

            {/* User lists sidebar */}
            <Suspense fallback={null}>
              <UserListsSidebar
                showUserLists={showUserLists}
                setShowUserLists={setShowUserLists}
                watchHistory={watchHistory}
                watchlist={watchlist}
                favorites={favorites}
                handleListItemClick={handleListItemClick}
              />
            </Suspense>
          </motion.div>
        </ErrorBoundary>
      </div>
    </motion.div>
  );
};

export default WatchPage;
