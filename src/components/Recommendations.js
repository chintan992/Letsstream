import React from 'react';

const Recommendations = ({ recommendations, handleListItemClick }) => {
  // Add fallback image handling
  const handleImageError = (e) => {
    e.target.src = '/fallback-poster.jpg';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white/90">Recommended</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        {recommendations.map((item) => (
          <div
            key={item.id}
            onClick={() => handleListItemClick(item)}
            className="flex flex-col gap-2 cursor-pointer group"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                data-src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-200"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-white/90 line-clamp-1 group-hover:text-[#02c39a] transition-colors">
                {item.title || item.name}
              </h3>
              <p className="text-xs text-white/60">
                {new Date(item.release_date || item.first_air_date).getFullYear()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
