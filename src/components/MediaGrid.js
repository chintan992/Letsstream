import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

function MediaGrid({ 
  mediaItems, 
  isStreamingLoading, 
  watchlist, 
  handleWatchlistToggle,
  noResults 
}) {
  if (isStreamingLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <div 
            key={index}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (noResults) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No results found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {mediaItems.map((item) => (
        <div key={item.id} className="relative group">
          <Link to={`/watch/${item.media_type}/${item.id}`}>
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-semibold text-sm">
                  {item.title || item.name}
                </h3>
                <div className="flex items-center text-xs mt-1">
                  <span>{new Date(item.release_date || item.first_air_date).getFullYear()}</span>
                  <span className="mx-2">•</span>
                  <span>{Math.round(item.vote_average * 10) / 10}</span>
                </div>
              </div>
            </div>
          </Link>
          <button
            onClick={() => handleWatchlistToggle(item)}
            className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 
              text-white hover:bg-opacity-75 transition-all duration-200
              transform scale-0 group-hover:scale-100"
            aria-label={watchlist?.some(w => w.id === item.id) ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {watchlist?.some(w => w.id === item.id) ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

MediaGrid.propTypes = {
  mediaItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      name: PropTypes.string,
      poster_path: PropTypes.string,
      release_date: PropTypes.string,
      first_air_date: PropTypes.string,
      vote_average: PropTypes.number,
      media_type: PropTypes.string.isRequired
    })
  ).isRequired,
  isStreamingLoading: PropTypes.bool.isRequired,
  watchlist: PropTypes.array.isRequired,
  handleWatchlistToggle: PropTypes.func.isRequired,
  noResults: PropTypes.bool.isRequired
};

export default MediaGrid;
