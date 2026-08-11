import React, { createContext, useCallback, useState, useEffect } from 'react';
import { authApi } from '../services/api';

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
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setWishlistLoading(true);
    try {
      const data = await authApi.getWishlist();
      setWishlist(data || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  }, [user]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!user) return false;
    const isWishlisted = wishlist.some(item => {
      const id = typeof item === 'object' && item !== null ? item._id : item;
      return id === productId;
    });
    try {
      if (isWishlisted) {
        await authApi.removeFromWishlist(productId);
        setWishlist(prev => prev.filter(item => {
          const id = typeof item === 'object' && item !== null ? item._id : item;
          return id !== productId;
        }));
      } else {
        await authApi.addToWishlist(productId);
        // Fetch full updated list to get proper product details
        const data = await authApi.getWishlist();
        setWishlist(data || []);
      }
      return true;
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      return false;
    }
  }, [user, wishlist]);

  useEffect(() => {
    fetchWishlist();
  }, [user, fetchWishlist]);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userInfo");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, wishlist, wishlistLoading, toggleWishlist, fetchWishlist }}>
        {children}
    </AuthContext.Provider>
  );
};
