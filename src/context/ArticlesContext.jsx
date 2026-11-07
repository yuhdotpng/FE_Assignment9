import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// ⚠️ SECURITY ISSUE: This context is shared globally with no user authentication
// All users see the same saved articles!
const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const [savedArticles, setSavedArticles] = useState([]);

   const { user } = useAuth();

  // 3. Check if there is a user and get only the user's recipies
  useEffect(() => {
    if (!user) {
      setSavedArticles([]);
      return;
    }

    // Load all favorites from localStorage
    const allSaved = JSON.parse(localStorage.getItem('savedArticlesByUser')) || {};
    
    // Get only the current user's favorites
    const userSaved = allSaved[user.username] || [];
    setSavedArticles(userSaved);
  }, [user]);

  const saveArticle = (article) => {
    setSavedArticles(prev => {
      // Check if article is already saved
      if (prev.find(a => a.url === userSaved.article.url)) {
        return prev;
      }
      return [...prev, article];
    });
  };

  const removeArticle = (url) => {
    setSavedArticles(prev => prev.filter(a => a.url !== url));
  };

  const isArticleSaved = (url) => {
    return savedArticles.some(a => a.url === url);
  };

  return (
    <ArticlesContext.Provider 
      value={{ 
        savedArticles, 
        saveArticle, 
        removeArticle, 
        isArticleSaved 
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
};