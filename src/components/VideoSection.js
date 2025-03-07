import React, { useEffect, useState, useCallback } from 'react';
import { getIframeSrc } from '../api';

const VideoSection = React.forwardRef(({ mediaData, isVideoReady, onSubmit, iframeRef, allowFullscreen, onSourceChange }, ref) => {
  const iframeSrc = getIframeSrc(mediaData);
  const [blockedPopups, setBlockedPopups] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to create a proxy window object
  const createWindowProxy = useCallback(() => {
    return new Proxy({}, {
      get: (target, prop) => {
        // Allow only essential properties and methods
        const allowedProps = ['postMessage', 'addEventListener', 'removeEventListener'];
        if (allowedProps.includes(prop)) {
          return window[prop].bind(window);
        }
        // Block and count popup attempts
        if (['open', 'alert', 'confirm', 'prompt'].includes(prop)) {
          setBlockedPopups(prev => prev + 1);
          return () => null;
        }
        // Return empty function for other window methods
        if (typeof window[prop] === 'function') {
          return () => null;
        }
        // Return null for other properties
        return null;
      },
      set: () => false // Prevent setting any properties
    });
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await ref.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  useEffect(() => {
    const currentIframe = iframeRef?.current;
    let cleanupFunctions = [];
    let popupInterval;

    const setupPopupBlocking = () => {
      try {
        if (currentIframe && currentIframe.contentWindow) {
          // Create proxied window object
          const windowProxy = createWindowProxy();

          // Override contentWindow properties
          Object.defineProperty(currentIframe, 'contentWindow', {
            get: () => windowProxy
          });

          // Block navigation attempts
          const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setBlockedPopups(prev => prev + 1);
            return event.returnValue = "Changes you made may not be saved.";
          };

          // Inject popup blocking script into iframe
          const injectBlocker = () => {
            try {
              const frame = currentIframe.contentWindow;
              if (frame) {
                const script = `
                  (function() {
                    // Block window.open and popup-related functions
                    window.open = function() { return null; };
                    window.alert = function() { return null; };
                    window.confirm = function() { return null; };
                    window.prompt = function() { return null; };
                    
                    // Block popup-like behaviors
                    window.moveTo = function() { return null; };
                    window.moveBy = function() { return null; };
                    window.resizeTo = function() { return null; };
                    window.resizeBy = function() { return null; };
                    window.focus = function() { return null; };
                    window.blur = function() { return null; };
                    
                    // Block common popup triggers
                    window.showModalDialog = function() { return null; };
                    window.showModelessDialog = function() { return null; };
                    window.print = function() { return null; };
                    
                    // Prevent creating new windows/tabs
                    Object.defineProperty(window, 'open', {
                      configurable: false,
                      writable: false,
                      value: function() { return null; }
                    });
                    
                    // Block popup-related events
                    window.addEventListener('click', function(e) {
                      if (e.target.tagName === 'A' && e.target.target === '_blank') {
                        e.preventDefault();
                      }
                    }, true);
                    
                    // Disable right-click context menu
                    window.addEventListener('contextmenu', function(e) {
                      e.preventDefault();
                    }, true);
                  })();
                `;

                const blocker = document.createElement('script');
                blocker.textContent = script;
                if (frame.document) {
                  frame.document.documentElement.appendChild(blocker);
                }
              }
            } catch (error) {
              console.debug("Error injecting popup blocker:", error);
            }
          };

          // Add event listeners
          window.addEventListener('beforeunload', handleBeforeUnload);
          currentIframe.addEventListener('load', injectBlocker);

          // Periodically reinject blocker
          popupInterval = setInterval(injectBlocker, 1000);

          // Store cleanup functions
          cleanupFunctions.push(() => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            currentIframe.removeEventListener('load', injectBlocker);
            clearInterval(popupInterval);
          });
        }
      } catch (error) {
        console.debug("Error in popup blocking setup:", error);
      }
    };

    setupPopupBlocking();

    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [iframeSrc, createWindowProxy, iframeRef]);

  return (
    <div 
      ref={ref}
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-[100] bg-black' : ''}`}
    >
      <div className={`relative ${isFullscreen ? 'h-screen' : 'aspect-video'}`}>
        {isVideoReady && (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="w-full h-full"
            title={`Video player for ${mediaData.type === 'movie' ? 'movie' : 'episode'}`}
            allow="fullscreen; autoplay"
            allowFullScreen={true}
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            msallowfullscreen="true"
            frameBorder="0"
            scrolling="no"
          />
        )}
        {blockedPopups > 0 && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {blockedPopups} popup{blockedPopups !== 1 ? 's' : ''} blocked
          </div>
        )}
      </div>
      {allowFullscreen && (
        <button
          onClick={handleFullscreenToggle}
          className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 
            transition-colors duration-200 text-white/90 hover:text-white z-20 group"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <svg 
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {isFullscreen ? (
              <>
                <path d="M6 9.99739C6.01447 8.29083 6.10921 7.35004 6.72963 6.72963C7.35004 6.10921 8.29083 6.01447 9.99739 6" 
                  strokeLinecap="round"/>
                <path d="M6 14.0007C6.01447 15.7072 6.10921 16.648 6.72963 17.2684C7.35004 17.8888 8.29083 17.9836 9.99739 17.998" 
                  strokeLinecap="round"/>
                <path d="M17.9976 9.99739C17.9831 8.29083 17.8883 7.35004 17.2679 6.72963C16.6475 6.10921 15.7067 6.01447 14.0002 6" 
                  strokeLinecap="round"/>
                <path d="M17.9976 14.0007C17.9831 15.7072 17.8883 16.648 17.2679 17.2684C16.6475 17.8888 15.7067 17.9836 14.0002 17.998" 
                  strokeLinecap="round"/>
                <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" 
                  strokeLinecap="round"/>
              </>
            ) : (
              <>
                <path d="M2 9.99739C2.01447 8.29083 2.10921 7.35004 2.72963 6.72963C3.35004 6.10921 4.29083 6.01447 5.99739 6" 
                  strokeLinecap="round"/>
                <path d="M2 14.0007C2.01447 15.7072 2.10921 16.648 2.72963 17.2684C3.35004 17.8888 4.29083 17.9836 5.99739 17.998" 
                  strokeLinecap="round"/>
                <path d="M21.9976 9.99739C21.9831 8.29083 21.8883 7.35004 21.2679 6.72963C20.6475 6.10921 19.7067 6.01447 18.0002 6" 
                  strokeLinecap="round"/>
                <path d="M21.9976 14.0007C21.9831 15.7072 21.8883 16.648 21.2679 17.2684C20.6475 17.8888 19.7067 17.9836 18.0002 17.998" 
                  strokeLinecap="round"/>
                <path d="M12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.43821 2.49074 5.80655 2.16443 8 2.05511" 
                  strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      )}
    </div>
  );
});

VideoSection.displayName = 'VideoSection';

export default VideoSection;
