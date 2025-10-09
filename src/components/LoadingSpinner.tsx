import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const LoadingSpinner = () => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <span className={`ml-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>Loading cryptocurrency data...</span>
    </div>
  );
};

export default LoadingSpinner;