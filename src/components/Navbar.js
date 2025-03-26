import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { logout } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { BsSunFill, BsMoonStarsFill, BsSearch, BsList, BsX, BsPerson, BsBoxArrowRight, BsGearFill } from 'react-icons/bs';
import SearchModal from './SearchModal';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 100; // Maximum scroll distance for full opacity
      const currentScroll = window.scrollY;
      const newOpacity = Math.min(currentScroll / maxScroll, 1);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const isTyping = ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase());
      
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isDarkMode 
            ? `bg-dark-bg/[${0.6 + (0.4 * scrollOpacity)}] border-dark-border` 
            : `bg-white/[${0.6 + (0.4 * scrollOpacity)}] border-gray-200`
        } border-b backdrop-blur-sm`}
        role="navigation"
        aria-label="Main navigation"
        style={{
          boxShadow: `0 0 10px rgba(0,0,0,${0.05 + (scrollOpacity * 0.1)})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className={`text-2xl font-bold transition-all duration-200 hover:scale-105 ${
                isDarkMode ? 'text-[#02c39a] hover:text-[#02c39a]' : 'text-primary-600 hover:text-[#02c39a]'
              }`}
              aria-label="Let's Stream Home"
            >
              Let's Stream
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-8" role="menubar">
              {['Discover', 'About', 'Support'].map((item) => {
                const path = item === 'Discover' ? '/' : `/${item.toLowerCase()}`;
                const active = isActiveRoute(path);
                
                return (
                  <Link
                    key={item}
                    to={path}
                    className={`relative py-2 transition-colors duration-200 group ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-700 hover:text-primary-600'
                    } ${active ? 'font-semibold' : ''}`}
                    role="menuitem"
                    aria-current={active ? 'page' : undefined}
                  >
                    {item}
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-200 ${
                        isDarkMode ? 'bg-primary-400' : 'bg-primary-600'
                      } ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} 
                    />
                  </Link>
                );
              })}
              <a
                href="https://letsstream2.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 animate-pulse hover:animate-none ${
                  isDarkMode
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Try V2.0 ✨
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                }`}
                aria-label="Open search"
              >
                <BsSearch className="w-5 h-5" />
              </button>

              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                }`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <BsMoonStarsFill className="w-5 h-5" /> : <BsSunFill className="w-5 h-5" />}
              </button>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-200 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                    }`}
                    aria-label="Open user menu"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                  >
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <BsPerson className="w-5 h-5" />
                    )}
                  </button>

                  {isProfileOpen && (
                    <div 
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 transition-all duration-200 ${
                        isDarkMode ? 'bg-dark-bg border border-dark-border' : 'bg-white border border-gray-200'
                      }`}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <Link
                        to="/profile"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center space-x-2">
                          <BsPerson className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center space-x-2">
                          <BsGearFill className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center space-x-2">
                          <BsBoxArrowRight className="w-4 h-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100/50'
                }`}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? (
                  <BsX className="w-6 h-6" />
                ) : (
                  <BsList className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div 
            className={`md:hidden transition-all duration-200 ${
              isDarkMode ? 'bg-dark-bg/95 border-dark-border' : 'bg-white/95 border-gray-200'
            }`}
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Discover', 'About', 'Support'].map((item) => {
                const path = item === 'Discover' ? '/' : `/${item.toLowerCase()}`;
                const active = isActiveRoute(path);
                
                return (
                  <Link
                    key={item}
                    to={path}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      active
                        ? isDarkMode
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-primary-600'
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                    }`}
                    role="menuitem"
                    aria-current={active ? 'page' : undefined}
                  >
                    {item}
                  </Link>
                );
              })}
              <a
                href="https://letsstream2.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 text-center ${
                  isDarkMode
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Try V2.0 ✨
              </a>
            </div>
          </div>
        )}
      </nav>

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;