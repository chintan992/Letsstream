import React from 'react';
import { Tab } from '@headlessui/react';
import { useDarkMode } from './DarkModeContext';

const ContentTabs = ({ 
  item, 
  detailedOverview, 
  showFullOverview, 
  setShowFullOverview,
  cast,
  crew,
  reviews,
  similar,
  handleListItemClick 
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Tab.Group>
      <Tab.List className={`flex space-x-1 rounded-xl ${isDarkMode ? 'bg-black/20' : 'bg-gray-100'} p-1`}>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
           ${selected 
            ? 'bg-[#02c39a] text-white shadow'
            : isDarkMode 
              ? 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
           }`
        }>
          Overview
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
           ${selected 
            ? 'bg-[#02c39a] text-white shadow'
            : isDarkMode 
              ? 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
           }`
        }>
          Cast & Crew
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
           ${selected 
            ? 'bg-[#02c39a] text-white shadow'
            : isDarkMode 
              ? 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
           }`
        }>
          Reviews
        </Tab>
      </Tab.List>
      <Tab.Panels className="mt-4">
        <Tab.Panel className="space-y-4">
          <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} ${!showFullOverview && 'line-clamp-3'}`}>
              {detailedOverview}
            </p>
            {detailedOverview?.length > 200 && (
              <button
                onClick={() => setShowFullOverview(!showFullOverview)}
                className="text-[#02c39a] hover:text-[#00a896] text-sm mt-2"
              >
                {showFullOverview ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </Tab.Panel>
        <Tab.Panel className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cast.map((person) => (
            <div key={person.id} className="text-center">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                <img
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/fallback-poster.jpg';
                  }}
                />
              </div>
              <p className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {person.name}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {person.character}
              </p>
            </div>
          ))}
        </Tab.Panel>
        <Tab.Panel>
          <ReviewsTab reviews={reviews} isDarkMode={isDarkMode} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

const ReviewsTab = ({ reviews, isDarkMode }) => (
  <div className="space-y-6">
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div 
          key={review.id} 
          className={`rounded-lg p-4 space-y-3 ${
            isDarkMode ? 'bg-white/5' : 'bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#02c39a]/20 flex items-center justify-center">
                <span className="text-[#02c39a] font-semibold">
                  {review.author_details?.name?.[0] || review.author[0]}
                </span>
              </div>
              <div>
                <h4 className={`font-medium ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                  {review.author}
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {review.author_details?.rating && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                isDarkMode ? 'bg-white/10' : 'bg-gray-100'
              }`}>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.396-.902 1.506-.902 1.902 0l1.286 2.93a1 1 0 00.832.604l3.018.33c.98.107 1.373 1.361.625 2.04l-2.3 2.112a1 1 0 00-.318.981l.669 2.983c.219.97-.857 1.73-1.726 1.218L10 14.147l-2.736 1.98c-.87.512-1.945-.248-1.726-1.218l.669-2.983a1 1 0 00-.318-.981l-2.3-2.112c-.748-.679-.355-1.933.625-2.04l3.018-.33a1 1 0 00.832-.604l1.286-2.93z" />
                </svg>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                  {review.author_details.rating}
                </span>
              </div>
            )}
          </div>
          <p className={`line-clamp-4 hover:line-clamp-none transition-all duration-200 ${
            isDarkMode ? 'text-white/80' : 'text-gray-700'
          }`}>
            {review.content}
          </p>
        </div>
      ))
    ) : (
      <div className={`text-center py-8 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
        No reviews available yet
      </div>
    )}
  </div>
);

export default ContentTabs;
