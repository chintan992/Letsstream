//src/components/SourceSelector.js
// Desc: SourceSelector component for selecting video source
import React from 'react';
import { VIDEO_SOURCES } from '../api';

const SourceSelector = ({ videoSource, handleSourceChange }) => {
  const selectedSource = VIDEO_SOURCES[videoSource];

  return (
    <div className="relative w-full group">
      {/* Custom-styled button */}
      <div className="w-full bg-white/5 dark:bg-gray-800/30 px-3 py-2 rounded-lg flex items-center justify-between 
          border border-white/10 dark:border-gray-700/30 group-hover:bg-white/10 dark:group-hover:bg-gray-700/50 
          transition-colors duration-200 pointer-events-none">
        <span className="flex items-center gap-2 truncate">
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="flex items-center gap-1 truncate text-white/90">
            <span className="truncate">{selectedSource?.name}</span>
            <span className="text-xs text-white/60 whitespace-nowrap">
              ({selectedSource?.quality})
            </span>
          </span>
        </span>
        <svg className="w-5 h-5 text-white/60 flex-shrink-0 transition-transform duration-200" 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Native select element */}
      <select
        value={videoSource}
        onChange={(e) => handleSourceChange(e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        aria-label="Select video source"
      >
        {Object.entries(VIDEO_SOURCES).map(([key, { name, quality }]) => (
          <option 
            key={key} 
            value={key}
            className="bg-[#1a2634] text-white py-2"
          >
            {name} ({quality})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SourceSelector;