import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Layout({ children }) {
  const { theme } = useTheme();
  
  React.useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark h-full' : 'h-full';
    document.body.className = theme === 'dark' 
      ? 'bg-gray-900 text-gray-100 min-h-full'
      : 'bg-gray-100 text-gray-900 min-h-full';
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {children}
    </div>
  );
}

export default Layout;
