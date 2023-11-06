import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
  const [token, setToken] = useState(Cookies.get('token'));  // Dodaj ten wiersz

  const login = (token) => {
    Cookies.set('token', token, { expires: 7 });
    setIsLoggedIn(true);
    setToken(token);  // Dodaj ten wiersz
  };

  const logout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    setToken(null);  // Dodaj ten wiersz
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token }}>  {/* Dodaj token tutaj */}
      {children}
    </AuthContext.Provider>
  );
};
