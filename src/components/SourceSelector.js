import React, { useRef, useEffect, useCallback } from 'react';
import { VIDEO_SOURCES } from '../api';

const SourceSelector = ({ videoSource, handleSourceChange, showSourceMenu, setShowSourceMenu }) => {
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const handleKeyDown = (event, key) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleSourceChange(key);
            setShowSourceMenu(false);
        }
    };

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
            setShowSourceMenu(false);
        }
    }, [dropdownRef, buttonRef, setShowSourceMenu]); // Dependencies for useCallback

    useEffect(() => {
        if (showSourceMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSourceMenu, handleClickOutside]); // Dependency includes handleClickOutside

    return (
        <div className="relative w-full">
            <button
                ref={buttonRef}
                onClick={() => setShowSourceMenu(!showSourceMenu)}
                className="w-full bg-white/5 dark:bg-gray-800/30 px-3 py-2 rounded-lg flex items-center justify-between 
                    border border-white/10 dark:border-gray-700/30 hover:bg-white/10 dark:hover:bg-gray-700/50 
                    transition-colors duration-200"
                aria-label="Select video source"
            >
                <span className="flex items-center gap-2 truncate">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="flex items-center gap-1 truncate text-white/90">
                        <span className="truncate">{VIDEO_SOURCES[videoSource]?.name}</span>
                        <span className="text-xs text-white/60 whitespace-nowrap">
                            ({VIDEO_SOURCES[videoSource]?.quality})
                        </span>
                    </span>
                </span>
                <svg className={`w-5 h-5 text-white/60 flex-shrink-0 transition-transform duration-200 ${showSourceMenu ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {showSourceMenu && (
                <div 
                    ref={dropdownRef} 
                    className="absolute mt-2 w-full rounded-lg bg-white/10 dark:bg-gray-800/90 backdrop-blur-md 
                        shadow-lg border border-white/10 dark:border-gray-700/30 z-50 max-h-[50vh] overflow-y-auto" 
                    role="menu"
                >
                    {Object.entries(VIDEO_SOURCES).map(([key, { name, quality }]) => (
                        <button
                            key={key}
                            onClick={() => {
                                handleSourceChange(key);
                                setShowSourceMenu(false);
                            }}
                            onKeyDown={(event) => handleKeyDown(event, key)}
                            className="w-full px-4 py-3 text-left hover:bg-white/10 dark:hover:bg-gray-700/50 
                                flex justify-between items-center text-white/90 transition-colors duration-200
                                border-b border-white/5 dark:border-gray-700/30 last:border-0"
                            role="menuitem"
                            tabIndex="0"
                        >
                            <span className="truncate pr-2">{name}</span>
                            <span className="text-xs text-white/60 whitespace-nowrap">{quality}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SourceSelector;
