import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from './DarkModeContext';

const UseBrave = () => {
  const { isDarkMode } = useDarkMode();
  const isBrave = navigator?.brave?.isBrave?.name === 'isBrave';

  if (isBrave) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-3 sm:p-4 rounded-lg ${
        isDarkMode 
          ? 'bg-yellow-500/10 border border-yellow-500/20' 
          : 'bg-yellow-50 border border-yellow-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${
          isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
        }`}>
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
            For the best streaming experience, we recommend using{' '}
            <a 
              href="https://brave.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium underline hover:text-yellow-600 transition-colors"
            >
              Brave Browser
            </a>
            . It has built-in popup and ad blocking features that enhance your viewing experience.
          </p>
        </div>
        <button 
          className={`shrink-0 p-1 rounded-full hover:bg-yellow-500/20 transition-colors ${
            isDarkMode ? 'text-yellow-200' : 'text-yellow-600'
          }`}
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default UseBrave;
