import React from 'react';
import toast from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    toast.error('Something went wrong. Please try refreshing the page.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-[#000e14] text-gray-900 dark:text-white">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600
                transition-colors duration-200 focus:outline-none focus:ring-2
                focus:ring-primary-500 focus:ring-offset-2"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
