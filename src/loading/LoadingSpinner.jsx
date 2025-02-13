import React from 'react';
import { Circle } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full bg-white/50 dark:bg-gray-900/50">
      {/* Main loading container */}
      <div className="relative flex flex-col items-center">
        {/* Primary spinner */}
        <div className="relative">
          {/* Outer circle */}
          <div className="w-12 h-12 rounded-full border-[3px] border-gray-200 dark:border-gray-700" />
          
          {/* Spinning accent */}
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full 
                       border-[3px] border-transparent border-t-blue-500
                       animate-spin" />
        </div>

        {/* Status indicator */}
        <div className="mt-6 flex items-center">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 
                       rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Circle className="w-4 h-4 text-blue-500 animate-pulse" />
              <div className="absolute top-0 left-0 w-4 h-4 rounded-full 
                           bg-blue-500/20 animate-ping" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Processing...
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="mt-4 w-48">
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500/20 rounded-full">
              <div className="h-full w-1/2 bg-blue-500 rounded-full animate-slide" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add keyframes for sliding animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;
document.head.appendChild(style);

export default LoadingSpinner;