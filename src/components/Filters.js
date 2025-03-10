import React from 'react';
import PropTypes from 'prop-types';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'movies', name: 'Movies' },
  { id: 'tv', name: 'TV Shows' },
  { id: 'trending', name: 'Trending' }
];

function Filters({ 
  activeCategory, 
  handleCategoryChange, 
  streamingServices, 
  activeStreamingService, 
  handleStreamingServiceClick 
}) {
  return (
    <div className="mb-8">
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200
              ${activeCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Streaming Services */}
      <div className="flex flex-wrap gap-2">
        {streamingServices.map((service) => (
          <button
            key={service.id}
            onClick={() => handleStreamingServiceClick(service.id)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${service.color}
              ${activeStreamingService === service.id
                ? 'ring-2 ring-white ring-opacity-60 scale-105'
                : 'opacity-75 hover:opacity-100'
              }`}
            aria-label={service.name}
            title={service.name}
          >
            {service.name}
          </button>
        ))}
      </div>
    </div>
  );
}

Filters.propTypes = {
  activeCategory: PropTypes.string.isRequired,
  handleCategoryChange: PropTypes.func.isRequired,
  streamingServices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
  activeStreamingService: PropTypes.number,
  handleStreamingServiceClick: PropTypes.func.isRequired
};

export default Filters;
