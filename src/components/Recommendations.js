import React from 'react';
import { motion } from 'framer-motion';

const Recommendations = ({ recommendations, handleListItemClick }) => {
  const handleImageError = (e) => {
    e.target.src = '/fallback-poster.jpg';
  };

  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="relative">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden 
          scrollbar-thin scrollbar-thumb-[#02c39a]/20 scrollbar-track-transparent 
          hover:scrollbar-thumb-[#02c39a]/40 sm:pr-2 pb-4
          snap-y snap-mandatory scroll-smooth touch-pan-y"
        >
          <div className="grid grid-cols-2 gap-3 min-w-0">
            {recommendations.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={() => handleListItemClick(item)}
                className="group relative flex flex-col gap-1.5 cursor-pointer snap-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <motion.p 
                        className="text-xs text-white/90 text-center line-clamp-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                      >
                        {item.overview?.slice(0, 50)}...
                      </motion.p>
                    </div>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-medium text-white/80 line-clamp-1 group-hover:text-[#02c39a] 
                    transition-colors"
                  >
                    {item.title || item.name}
                  </h3>
                  {(item.release_date || item.first_air_date) && (
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] text-white/60">
                        {new Date(item.release_date || item.first_air_date).getFullYear()}
                      </p>
                      {item.vote_average > 0 && (
                        <div className="flex items-center gap-0.5 text-[10px] text-white/60">
                          <span>•</span>
                          <span className="text-[#02c39a]">{item.vote_average.toFixed(1)}</span>
                          <svg className="w-2.5 h-2.5 text-[#02c39a]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Recommendations;
