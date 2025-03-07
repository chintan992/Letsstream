import React from 'react';
//import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
//import { User, Star } from 'react-feather';

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
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-black/20 p-1">
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5
           ${selected 
            ? 'bg-[#02c39a] text-white dark:text-black shadow'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'}`
        }>
          Overview
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5
           ${selected 
            ? 'bg-[#02c39a] text-white dark:text-black shadow'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'}`
        }>
          Cast & Crew
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5
           ${selected 
            ? 'bg-[#02c39a] text-white dark:text-black shadow'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'}`
        }>
          Reviews
        </Tab>
      </Tab.List>
      <Tab.Panels className="mt-4">
        <Tab.Panel className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <p className={`text-gray-800 dark:text-gray-200 ${!showFullOverview && 'line-clamp-3'}`}>
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
              <img
                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                alt={person.name}
                className="w-full rounded-lg"
              />
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{person.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{person.character}</p>
            </div>
          ))}
        </Tab.Panel>
        <Tab.Panel>
          <ReviewsTab reviews={reviews} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

const ReviewsTab = ({ reviews }) => (
  <div className="space-y-6">
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div 
          key={review.id} 
          className="bg-white/5 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#02c39a]/20 flex items-center justify-center">
                <span className="text-[#02c39a] font-semibold">
                  {review.author_details?.name?.[0] || review.author[0]}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-white/90">{review.author}</h4>
                <p className="text-sm text-white/60">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {review.author_details?.rating && (
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.396-.902 1.506-.902 1.902 0l1.286 2.93a1 1 0 00.832.604l3.018.33c.98.107 1.373 1.361.625 2.04l-2.3 2.112a1 1 0 00-.318.981l.669 2.983c.219.97-.857 1.73-1.726 1.218L10 14.147l-2.736 1.98c-.87.512-1.945-.248-1.726-1.218l.669-2.983a1 1 0 00-.318-.981l-2.3-2.112c-.748-.679-.355-1.933.625-2.04l3.018-.33a1 1 0 00.832-.604l1.286-2.93z" />
                </svg>
                <span className="text-sm font-medium text-white/90">
                  {review.author_details.rating}
                </span>
              </div>
            )}
          </div>
          <p className="text-white/80 line-clamp-4 hover:line-clamp-none transition-all duration-200">
            {review.content}
          </p>
        </div>
      ))
    ) : (
      <div className="text-center text-white/60 py-8">
        No reviews available yet
      </div>
    )}
  </div>
);

export default ContentTabs;
