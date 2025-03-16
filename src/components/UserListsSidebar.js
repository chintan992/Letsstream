import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';

const ListSection = ({ items, onItemClick, emptyMessage }) => {
  const { isDarkMode } = useDarkMode();
  
  if (!items?.length) {
    return (
      <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <motion.div
          key={`${item.id}-${item.watchedAt?.seconds}`}
          onClick={() => onItemClick(item)}
          className={`flex items-center p-2 rounded-lg cursor-pointer ${
            isDarkMode 
              ? 'hover:bg-white/5' 
              : 'hover:bg-gray-50'
          } transition-colors duration-200`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-12 h-16 rounded overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className={`font-medium line-clamp-1 ${
              isDarkMode ? 'text-white/90' : 'text-gray-900'
            }`}>
              {item.title || item.name}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
              {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
              {item.watchedAt && (
                <span className="ml-2">
                  • {new Date(item.watchedAt.seconds * 1000).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const SectionTitle = ({ section, isMinimized, icon, title, count, onToggle }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className={`font-medium ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
          {title}
        </h3>
        {count > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            isDarkMode 
              ? 'bg-white/10 text-white/70' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {count}
          </span>
        )}
      </div>
      <button 
        onClick={onToggle}
        className={`p-1 rounded-lg transition-colors ${
          isDarkMode 
            ? 'hover:bg-white/5 text-white/60 hover:text-white/90' 
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
        }`}
      >
        <svg 
          className={`w-5 h-5 transform transition-transform duration-200 ${
            isMinimized ? '-rotate-90' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
};

const UserListsSidebar = ({ 
  showUserLists, 
  setShowUserLists, 
  watchHistory, 
  watchlist, 
  favorites, 
  handleListItemClick 
}) => {
  const { isDarkMode } = useDarkMode();
  const [minimizedSections, setMinimizedSections] = useState({
    history: false,
    watchlist: false,
    favorites: false
  });

  const toggleSection = (section) => {
    setMinimizedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showUserLists && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed inset-y-0 left-0 w-full sm:w-96 z-[70] ${
              isDarkMode 
                ? 'bg-[#0a1118]/95 backdrop-blur-md' 
                : 'bg-white/95 backdrop-blur-md'
            } shadow-2xl`}
          >
            {/* Header */}
            <div className={`px-4 py-3 border-b ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white/90' : 'text-gray-900'
                }`}>
                  My Lists
                </h2>
                <button
                  onClick={() => setShowUserLists(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-white/5 text-white/60 hover:text-white/90' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Watch History Section */}
              <div className={`${
                isDarkMode 
                  ? 'bg-white/5' 
                  : 'bg-gray-50'
              } rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <SectionTitle
                  section="history"
                  isMinimized={minimizedSections.history}
                  onToggle={() => toggleSection('history')}
                  icon={
                    <svg className={`w-5 h-5 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  title="Watch History"
                  count={watchHistory?.length}
                />
                <div className={`transition-all duration-300 overflow-hidden mt-3 ${
                  minimizedSections.history ? 'h-0 opacity-0' : 'opacity-100'
                }`}>
                  <ListSection
                    items={watchHistory}
                    onItemClick={handleListItemClick}
                    emptyMessage="No watch history yet"
                  />
                </div>
              </div>

              {/* Watchlist Section */}
              <div className={`${
                isDarkMode 
                  ? 'bg-white/5' 
                  : 'bg-gray-50'
              } rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <SectionTitle
                  section="watchlist"
                  isMinimized={minimizedSections.watchlist}
                  onToggle={() => toggleSection('watchlist')}
                  icon={
                    <svg className={`w-5 h-5 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  }
                  title="Watchlist"
                  count={watchlist?.length}
                />
                <div className={`transition-all duration-300 overflow-hidden mt-3 ${
                  minimizedSections.watchlist ? 'h-0 opacity-0' : 'opacity-100'
                }`}>
                  <ListSection
                    items={watchlist}
                    onItemClick={handleListItemClick}
                    emptyMessage="Your watchlist is empty"
                  />
                </div>
              </div>

              {/* Favorites Section */}
              <div className={`${
                isDarkMode 
                  ? 'bg-white/5' 
                  : 'bg-gray-50'
              } rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <SectionTitle
                  section="favorites"
                  isMinimized={minimizedSections.favorites}
                  onToggle={() => toggleSection('favorites')}
                  icon={
                    <svg className={`w-5 h-5 ${
                      isDarkMode ? 'text-red-400' : 'text-red-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                  title="Favorites"
                  count={favorites?.length}
                />
                <div className={`transition-all duration-300 overflow-hidden mt-3 ${
                  minimizedSections.favorites ? 'h-0 opacity-0' : 'opacity-100'
                }`}>
                  <ListSection
                    items={favorites}
                    onItemClick={handleListItemClick}
                    emptyMessage="No favorites yet"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4">
              <Link
                to="/profile"
                onClick={() => setShowUserLists(false)}
                className={`w-full py-3 px-4 ${
                  isDarkMode 
                    ? 'bg-[#02c39a] hover:bg-[#00a896]' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded-xl
                transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                font-medium flex items-center justify-center gap-2
                shadow-sm hover:shadow-md`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Full Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

UserListsSidebar.propTypes = {
  showUserLists: PropTypes.bool.isRequired,
  setShowUserLists: PropTypes.func.isRequired,
  watchHistory: PropTypes.array,
  watchlist: PropTypes.array,
  favorites: PropTypes.array,
  handleListItemClick: PropTypes.func.isRequired
};

export default UserListsSidebar;
