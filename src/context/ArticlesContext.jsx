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

  const saveArticle = (article) =>{
  if (!user) return;

  const username = user.username;

  setSavedArticlesByUser(prev => {
    const userArticles = prev[username] || [];

    // Check for duplicates in this user's list.
    if (userArticles.some(a => a.url === article.url)) {
      return prev;
    }

    // Preserve other users' entries and update this user's list.
    return {
      ...prev,
      [username]: [...userArticles, article]
    };
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
  return getUserSavedArticles().some(a => a.url === url);
};
  const getAllUserArticle = () => {
  const allArticles = JSON.parse(localStorage.getItem('savedArticlesByUser')) || {};
  return allArticles;
}




  return (
    <ArticlesContext.Provider 
      value={{ 
        getUserSavedArticles, 
        saveArticle, 
        removeArticle, 
        isArticleSaved,
        getAllUserArticle
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