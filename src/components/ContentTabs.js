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
            ? 'bg-[#02c39a] text-white shadow'
            : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'}`
        }>
          Overview
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5
           ${selected 
            ? 'bg-[#02c39a] text-white shadow'
            : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'}`
        }>
          Cast & Crew
        </Tab>
        <Tab className={({ selected }) =>
          `w-full rounded-lg py-2.5 text-sm font-medium leading-5
           ${selected 
            ? 'bg-[#02c39a] text-white shadow'
            : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'}`
        }>
          Reviews
        </Tab>
      </Tab.List>
      <Tab.Panels className="mt-4">
        <Tab.Panel className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <p className={`text-gray-300 ${!showFullOverview && 'line-clamp-3'}`}>
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
              <p className="mt-2 text-sm font-medium text-white">{person.name}</p>
              <p className="text-xs text-gray-400">{person.character}</p>
            </div>
          ))}
        </Tab.Panel>
        <Tab.Panel>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-black/20 rounded-lg p-4">
                <p className="text-gray-300">{review.content}</p>
                <p className="mt-2 text-sm text-gray-400">- {review.author}</p>
              </div>
            ))}
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default ContentTabs;
