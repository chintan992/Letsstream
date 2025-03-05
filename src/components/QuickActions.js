import React from 'react';
import { motion } from 'framer-motion';

const QuickActions = ({
  isInWatchlist,
  isInFavorites,
  handleWatchlistToggle,
  handleFavoritesToggle
}) => {
  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <motion.button
          onClick={handleWatchlistToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full backdrop-blur-sm text-sm sm:text-base
            ${isInWatchlist
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-[#02c39a] hover:bg-[#00a896]'}
            text-white transition-colors`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={isInWatchlist
                ? "M6 18L18 6M6 6l12 12"
                : "M12 4v16m8-8H4"} />
          </svg>
          <span className="whitespace-nowrap">Watchlist</span>
        </motion.button>

        <motion.button
          onClick={handleFavoritesToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full backdrop-blur-sm text-sm sm:text-base
            ${isInFavorites
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-[#02c39a] hover:bg-[#00a896]'}
            text-white transition-colors`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isInFavorites ? "currentColor" : "none"}
            stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="whitespace-nowrap">Favorites</span>
        </motion.button>
      </div>
    </div>
  );
};

export default QuickActions;
