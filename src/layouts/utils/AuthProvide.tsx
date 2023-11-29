import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { redirect } from 'react-router-dom';

const AuthContext = createContext<{
  user: { token: string; name: string; role: string } | null;
  login: (token: string, name: string, role: string) => void;
  logout: () => void;
} | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user state from local storage if a token exists
  const initialToken = localStorage.getItem('jwt_token');
  const initialName = localStorage.getItem('name') || '';
  const initialRole = localStorage.getItem('role') || '';
  const initialUser = initialToken
    ? { token: initialToken, name: initialName, role: initialRole }
    : null;
  const [user, setUser] = useState(initialUser);

  const login = (token: string, name: string, role: string) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem("name", name);
    localStorage.setItem("role", role);
    setUser({ token, name, role });
  };

  const logout = async () => {
    try {
      // Remove items from localStorage
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('name');
      localStorage.removeItem('role');

      // Call the logout API
      const response = await fetch("http://localhost:8080/auth/logout");

      if (response.ok) {
        // If the API call is successful, clear the user state

        setUser(null);
        // redirect("/home");
      window.location.href="/home"


      } else {
        // Handle authentication error here, e.g., display an error message to the user
        console.error('Logout failed');
      }
    } catch (error) {
      // Handle any other errors that may occur
      console.error('An error occurred during logout:', error);
    }
  }


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
