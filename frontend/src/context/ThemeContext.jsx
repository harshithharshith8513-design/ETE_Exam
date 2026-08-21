import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME_PRESETS = [
  {
    id: 'light',
    name: 'White & Emerald Mint',
    mode: 'light',
    bgPage: '#E6F7F0',
    bgCard: '#FFFFFF',
    accentPrimary: '#10B981',
    textMain: '#0F172A'
  },
  {
    id: 'dark',
    name: 'Dark Violet & Lilac',
    mode: 'dark',
    bgPage: '#0D021A',
    bgCard: '#130924',
    accentPrimary: '#8B5CF6',
    textMain: '#FFFFFF'
  }
];

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = localStorage.getItem('ideahub_theme_mode');
      return saved === 'light' || saved === 'dark' ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  const currentPreset = THEME_PRESETS.find((p) => p.mode === themeMode) || THEME_PRESETS[0];

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('ideahub_theme_mode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeByMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setThemeMode(mode);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        currentPreset,
        themePresets: THEME_PRESETS,
        toggleTheme,
        setThemeByMode,
        isDark: themeMode === 'dark'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
