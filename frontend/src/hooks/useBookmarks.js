import { useState, useEffect } from 'react';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('ideahub_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ideahub_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (ideaId) => {
    setBookmarks((prev) => {
      if (prev.includes(ideaId)) {
        return prev.filter((id) => id !== ideaId);
      } else {
        return [...prev, ideaId];
      }
    });
  };

  const isBookmarked = (ideaId) => bookmarks.includes(ideaId);

  return { bookmarks, toggleBookmark, isBookmarked };
};
