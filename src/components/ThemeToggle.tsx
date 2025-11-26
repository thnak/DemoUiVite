import React from 'react';

import { useTheme } from '../hooks/use-theme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    // fallback to center if computation is odd
    toggle({ x: isFinite(x) ? x : 0.5, y: isFinite(y) ? y : 0.5 });
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={onClick}
      className="inline-flex items-center justify-center p-2 rounded-md border bg-transparent hover:opacity-90 transition"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 17.95l-1.414 1.414M17.95 17.95l1.414 1.414M6.464 6.464L5.05 5.05M12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
};
