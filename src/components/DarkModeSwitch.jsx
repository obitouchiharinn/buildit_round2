'use client';

import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DarkModeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // Current theme logic
  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light';

  // Accessibility: Add ARIA labels for better screen reader support
  const handleToggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggleTheme}
      className="text-xl cursor-pointer hover:text-amber-500 transition-colors duration-300"
      aria-label={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {currentTheme === 'light' ? <MdDarkMode /> : <MdLightMode />}
    </button>
  );
}
