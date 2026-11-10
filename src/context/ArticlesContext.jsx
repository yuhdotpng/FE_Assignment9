import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// ⚠️ SECURITY ISSUE: This context is shared globally with no user authentication
// All users see the same saved articles!
const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const { user } = useAuth();

  const [savedArticlesByUser, setSavedArticlesByUser] = useState(() => {
    const stored = localStorage.getItem('savedArticlesByUser');
    return stored ? JSON.parse(stored) : {};
  });

  // 3. Check if there is a user and get only the user's recipies
    useEffect(() => {
    localStorage.setItem(
      'savedArticlesByUser',
      JSON.stringify(savedArticlesByUser)
    );
  }, [savedArticlesByUser]);

  const getUserSavedArticles = () => {
  if (!user) return [];
  return savedArticlesByUser[user.username] || [];
};

  const saveArticle = (article) => {
    setSavedArticlesByUser(prev => {
      // Check if article is already saved
      if (prev.find(a => a.url === article.url)) {
        return prev;
      }
      return [...prev, article];
    });
  };

  

 const removeArticle = (url) => {
  if (!user) return;

  const username = user.username;

  setSavedArticlesByUser(prev => ({
    ...prev,
    [username]: (prev[username] || []).filter(
      article => article.url !== url
    )
  }));
};


  const isArticleSaved = (url) => {
    return getUserSavedArticles(a => a.url === url);
  };

  return (
    <ArticlesContext.Provider 
      value={{ 
        getUserSavedArticles, 
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