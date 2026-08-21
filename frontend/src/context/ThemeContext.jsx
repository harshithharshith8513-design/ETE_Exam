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
    accentSecondary: '#059669',
    textMain: '#0F172A',
    badgeText: 'Emerald Mint 🌿'
  },
  {
    id: 'dark',
    name: 'Dark Violet & Lilac',
    mode: 'dark',
    bgPage: '#0D021A',
    bgCard: '#130924',
    accentPrimary: '#8B5CF6',
    accentSecondary: '#A855F7',
    textMain: '#FFFFFF',
    badgeText: 'Violet & Lilac 🔮'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon Sunset',
    mode: 'dark',
    bgPage: '#080511',
    bgCard: '#140D28',
    accentPrimary: '#FF007F',
    accentSecondary: '#00F0FF',
    textMain: '#F8FAFC',
    badgeText: 'Cyberpunk Neon ⚡'
  },
  {
    id: 'amber',
    name: 'Solar Amber & Cream',
    mode: 'light',
    bgPage: '#FFFBEB',
    bgCard: '#FFFFFF',
    accentPrimary: '#D97706',
    accentSecondary: '#F59E0B',
    textMain: '#451A03',
    badgeText: 'Warm Amber ☀️'
  },
  {
    id: 'ocean',
    name: 'Oceanic Sapphire & Cyan',
    mode: 'dark',
    bgPage: '#041527',
    bgCard: '#0B2747',
    accentPrimary: '#06B6D4',
    accentSecondary: '#38BDF8',
    textMain: '#F0F9FF',
    badgeText: 'Deep Ocean 🌊'
  },
  {
    id: 'rose',
    name: 'Midnight Rose & Gold',
    mode: 'dark',
    bgPage: '#160710',
    bgCard: '#270E1D',
    accentPrimary: '#F43F5E',
    accentSecondary: '#FB7185',
    textMain: '#FFF1F2',
    badgeText: 'Velvet Rose 🌹'
  }
];

export const ThemeProvider = ({ children }) => {
  const [activeThemeId, setActiveThemeId] = useState(() => {
    try {
      const saved = localStorage.getItem('ideahub_theme_id');
      const exists = THEME_PRESETS.some((t) => t.id === saved);
      return exists ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  const currentPreset = THEME_PRESETS.find((p) => p.id === activeThemeId) || THEME_PRESETS[0];

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentPreset.id);

    if (currentPreset.mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    localStorage.setItem('ideahub_theme_id', currentPreset.id);
  }, [currentPreset]);

  const setThemeById = (id) => {
    if (THEME_PRESETS.some((t) => t.id === id)) {
      setActiveThemeId(id);
    }
  };

  const toggleTheme = () => {
    const currentIndex = THEME_PRESETS.findIndex((p) => p.id === activeThemeId);
    const nextIndex = (currentIndex + 1) % THEME_PRESETS.length;
    setActiveThemeId(THEME_PRESETS[nextIndex].id);
  };

  return (
    <ThemeContext.Provider
      value={{
        activeThemeId,
        currentPreset,
        themePresets: THEME_PRESETS,
        setThemeById,
        toggleTheme,
        isDark: currentPreset.mode === 'dark'
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
