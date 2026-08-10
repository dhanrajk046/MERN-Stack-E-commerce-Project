import React, { createContext, useCallback, useState } from 'react';

export const AuthContext = createContext();

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo') || 'null');
  } catch {
    localStorage.removeItem('userInfo');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userInfo");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
  );
};
