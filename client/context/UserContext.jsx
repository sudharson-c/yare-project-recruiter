// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, [isLoaded, isSignedIn, user]);
  const login = (user)=>{
    setCurrentUser(user);
  }
  const logout = ()=>{
    setCurrentUser(null);
  }
  return (
    <UserContext.Provider value={{ currentUser,login,logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider};
