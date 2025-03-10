import React from 'react';
import PropTypes from 'prop-types';

function ViewMoreButton({ hasMore, handleViewMore, isLoadingMore }) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={handleViewMore}
        disabled={isLoadingMore}
        className="px-6 py-2 bg-primary-500 text-white rounded-lg 
          hover:bg-primary-600 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 
          focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingMore ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Loading...
          </div>
        ) : (
          'View More'
        )}
      </button>
    </div>
  );
}

ViewMoreButton.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  handleViewMore: PropTypes.func.isRequired,
  isLoadingMore: PropTypes.bool.isRequired
};

export default ViewMoreButton;
