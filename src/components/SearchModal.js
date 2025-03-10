import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsSearch, BsArrowReturnLeft } from 'react-icons/bs';
import { useDarkMode } from './DarkModeContext';
import { useSearch } from '../context/SearchContext';

const SearchModal = ({ isOpen, onClose, onSearchSubmit }) => {
  const { isDarkMode } = useDarkMode();
  const { setQuery } = useSearch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const debouncedSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    if (isOffline) {
      setErrorMessage('Search is not available offline');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}&page=1`,
        {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'public, max-age=3600',
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Search failed. Please try again.');
      }

      const data = await response.json();
      
      const filteredResults = data.results
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          title: item.title || item.name,
          mediaType: item.media_type,
          year: item.release_date || item.first_air_date
            ? new Date(item.release_date || item.first_air_date).getFullYear()
            : null
        }));

      setSuggestions(filteredResults);
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrorMessage('Search timed out. Please try again.');
      } else {
        setErrorMessage(error.message || 'Failed to fetch suggestions');
      }
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedSuggestion > -1) {
      e.preventDefault();
      const selectedItem = suggestions[selectedSuggestion];
      handleSearchSubmit(e, selectedItem);
    }
  };

  const handleSearchSubmit = (e, suggestionData = null) => {
    e.preventDefault();
    if (suggestionData) {
      const route = suggestionData.mediaType === 'movie' ? 'movie' : 'tv';
      navigate(`/watch/${route}/${suggestionData.id}`);
    } else if (searchQuery.trim()) {
      setQuery(searchQuery.trim());
      navigate('/search');
    }
    onClose();
    setSearchQuery('');
    setSuggestions([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity" 
          onClick={onClose}
        >
          <div className={`absolute inset-0 ${
            isDarkMode ? 'bg-black/75' : 'bg-gray-500/75'
          }`} />
        </div>

        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
          isDarkMode ? 'bg-dark-bg' : 'bg-white'
        }`}>
          <form onSubmit={handleSearchSubmit} className="p-4">
            <div className="flex items-center space-x-4">
              <BsSearch className={`w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyDown={handleKeyDown}
                placeholder="Search videos... (Press '/' to focus)"
                className={`w-full bg-transparent border-none focus:ring-0 text-lg ${
                  isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
                autoFocus
              />
              <button
                type="submit"
                className={`p-2 rounded-md transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                } flex items-center justify-center`}
                aria-label="Submit search"
              >
                <BsArrowReturnLeft className="w-5 h-5" />
              </button>
              <kbd className={`hidden sm:inline-block px-2 py-1 text-xs font-semibold rounded ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-400 border border-gray-700'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}>
                ESC
              </kbd>
            </div>

            {errorMessage && (
              <div className={`mt-2 px-4 py-2 text-sm rounded ${
                isDarkMode 
                  ? 'bg-red-900/50 text-red-200' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {errorMessage}
              </div>
            )}

            {isOffline && (
              <div className={`mt-2 px-4 py-2 text-sm rounded ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                You are currently offline
              </div>
            )}

            {(suggestions.length > 0 || isLoading) && !errorMessage && (
              <div className={`mt-2 py-2 ${
                isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
              }`}>
                {isLoading ? (
                  <div className={`px-4 py-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Searching...
                  </div>
                ) : (
                  suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      onClick={(e) => handleSearchSubmit(e, suggestion)}
                      className={`px-4 py-2 cursor-pointer ${
                        index === selectedSuggestion
                          ? isDarkMode
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-primary-600'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{suggestion.title}</span>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {suggestion.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                          {suggestion.year ? ` (${suggestion.year})` : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;