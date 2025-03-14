import React from 'react';

const EpisodeGrid = ({ type, mediaData, episodes, seasons, currentEpisode, handleInputChange }) => {
  if (type !== 'tv') return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
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
              Season {season.season_number}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {episodes.map((episode) => (
          <button
            key={episode.id}
            className={`relative group ${
              currentEpisode?.id === episode.id ? 'ring-2 ring-[#02c39a]' : ''
            } rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-colors`}
            onClick={() => handleInputChange({
              target: { name: 'episodeNo', value: episode.episode_number.toString() }
            })}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900/40 backdrop-blur-sm">
              {episode.still_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                  alt={episode.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No Preview</span>
                </div>
              )}
              
              {currentEpisode?.id === episode.id && (
                <div className="absolute top-2 right-2 flex items-center gap-2 
                  bg-[#02c39a] dark:bg-[#00edb8] px-3 py-1 rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs text-black font-medium">Playing</span>
                </div>
              )}
            </div>

            <div className="p-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 font-medium">
                  Episode {episode.episode_number}
                </span>
                {episode.vote_average > 0 && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                    {episode.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-[#02c39a] transition-colors">
                {episode.name}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EpisodeGrid;
