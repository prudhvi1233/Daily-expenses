import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const localUser = JSON.parse(userInfoStr);
        setUser(localUser);
        
        // Fetch latest data from backend to ensure wallet balance is synced
        try {
          const res = await api.get('/users/me');
          const latestUser = { ...localUser, ...res.data };
          setUser(latestUser);
          localStorage.setItem('userInfo', JSON.stringify(latestUser));
        } catch (error) {
          console.error('Failed to sync latest user data:', error);
          if (error.response?.status === 401) {
            // Token is likely expired/invalid
            setUser(null);
            localStorage.removeItem('userInfo');
          }
        }
      }
      
      const pic = localStorage.getItem('profilePic');
      if (pic) {
        setProfilePic(pic);
      }
      
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/users/login', { email, password });
      setUser(res.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const res = await api.post('/users', { name, email, password });
      setUser(res.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    setProfilePic(null);
    localStorage.removeItem('profilePic');
  };

  const updateProfilePic = (base64) => {
    setProfilePic(base64);
    if (base64) {
      localStorage.setItem('profilePic', base64);
    } else {
      localStorage.removeItem('profilePic');
    }
  };

  const updateUser = (updatedData) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('userInfo', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, profilePic, updateProfilePic, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
