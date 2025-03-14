import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'react-tooltip';

const EpisodeNavigation = ({
  episodes,
  currentEpisodeNo,
  season,
  onEpisodeChange,
  isDarkMode,
  isLoading
}) => {
  const currentEpisodeIndex = episodes.findIndex(ep => ep.episode_number === parseInt(currentEpisodeNo));
  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = currentEpisodeIndex < episodes.length - 1;
  const currentEpisode = episodes[currentEpisodeIndex];

  const handlePrevious = () => {
    if (hasPrevious) onEpisodeChange(episodes[currentEpisodeIndex - 1].episode_number);
  };

  const handleNext = () => {
    if (hasNext) onEpisodeChange(episodes[currentEpisodeIndex + 1].episode_number);
  };

  if (!episodes.length || !currentEpisode) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      <motion.button
        onClick={handlePrevious}
        disabled={!hasPrevious || isLoading}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
          isDarkMode
            ? 'text-white hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent'
            : 'text-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent'
        }`}
        whileHover={hasPrevious && !isLoading ? { scale: 1.02 } : {}}
        whileTap={hasPrevious && !isLoading ? { scale: 0.98 } : {}}
        data-tooltip-id="prev-tooltip"
        data-tooltip-content={hasPrevious ?
          `S${season} E${episodes[currentEpisodeIndex - 1]?.episode_number}: ${episodes[currentEpisodeIndex - 1]?.name}` :
          'First episode'}
      >
        <ChevronLeftIcon className="w-5 h-5" />
        <span className="whitespace-nowrap">Previous</span>
      </motion.button>

      <AnimatePresence mode="wait">
        {currentEpisode && (
          <motion.div
            key={currentEpisode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 min-w-0 px-3 py-2 text-center"
          >
            <span className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span className="font-medium">
                S{season} E{currentEpisode.episode_number}
              </span>
              <span className="text-gray-500 dark:text-gray-400 truncate text-sm">
                {currentEpisode.name}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleNext}
        disabled={!hasNext || isLoading}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
          isDarkMode
            ? 'text-white hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent'
            : 'text-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent'
        }`}
        whileHover={hasNext && !isLoading ? { scale: 1.02 } : {}}
        whileTap={hasNext && !isLoading ? { scale: 0.98 } : {}}
        data-tooltip-id="next-tooltip"
        data-tooltip-content={hasNext ?
          `S${season} E${episodes[currentEpisodeIndex + 1]?.episode_number}: ${episodes[currentEpisodeIndex + 1]?.name}` :
          'Next episode coming soon'}
      >
        <span className="whitespace-nowrap">Next</span>
        <ChevronRightIcon className="w-5 h-5" />
      </motion.button>

      <Tooltip id="prev-tooltip" className="max-w-xs z-[100]" />
      <Tooltip id="next-tooltip" className="max-w-xs z-[100]" />
    </div>
  );
};

export default EpisodeNavigation;
