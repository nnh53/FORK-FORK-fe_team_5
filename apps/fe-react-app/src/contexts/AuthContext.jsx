import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    history.push('/login');//logout xong ve login
  };

  return(
    <AuthContext.Provider value={{ isloggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
  
};

export default useAuth = () => useContext(AuthContext);