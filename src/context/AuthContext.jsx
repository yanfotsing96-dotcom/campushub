/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS, DEFAULT_USER } from '../constants/academicConstants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return storageService.get(STORAGE_KEYS.AUTH_USER, DEFAULT_USER);
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (user) {
      storageService.set(STORAGE_KEYS.AUTH_USER, user);
    }
  }, [user]);

  const login = (email) => {
    const existing = storageService.get(STORAGE_KEYS.AUTH_USER, DEFAULT_USER);
    const updated = {
      ...existing,
      email: email || existing.email,
    };
    setUser(updated);
    setIsAuthenticated(true);
    storageService.set(STORAGE_KEYS.AUTH_USER, updated);
    return updated;
  };

  const register = (formData) => {
    const newUser = {
      id: 'usr_' + Date.now(),
      nom: formData.nom || 'Étudiant UY1',
      email: formData.email,
      filiere: formData.filiere || 'Informatique',
      niveau: formData.niveau || 'L1',
      matricule: '26U' + Math.floor(1000 + Math.random() * 9000),
      bio: formData.bio || 'Nouvel étudiant inscrit sur le portail académique CampusHub.',
      avatar: formData.photo ? URL.createObjectURL(formData.photo) : null,
      badges: ['🚀 Nouvel Arrivant', '📚 CampusHub UY1'],
      stats: {
        contributions: 0,
        downloads: 0,
        favoritesCount: 0,
      },
    };
    setUser(newUser);
    setIsAuthenticated(true);
    storageService.set(STORAGE_KEYS.AUTH_USER, newUser);
    return newUser;
  };

  const updateProfile = (partialUpdates) => {
    setUser((prev) => {
      const updated = { ...prev, ...partialUpdates };
      storageService.set(STORAGE_KEYS.AUTH_USER, updated);
      return updated;
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
