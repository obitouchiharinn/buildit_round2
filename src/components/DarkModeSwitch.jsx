'use client';

import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DarkModeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    setMounted(true); // Ensure mounted is true after the first render on the client-side
  }, []);

  if (!mounted) return null; // Don't render anything until the component is mounted

  return (
    <div>
      {currentTheme === 'dark' ? (
        <MdLightMode
          onClick={() => setTheme('light')}
          className='text-xl cursor-pointer hover:text-amber-500'
        />
      ) : (
        <MdDarkMode
          onClick={() => setTheme('dark')}
          className='text-xl cursor-pointer hover:text-amber-500'
        />
      )}
    </div>
  );
}
