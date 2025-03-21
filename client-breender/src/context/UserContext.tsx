import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
  userEmail: string | null;
  setUserEmail: (email: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [cookies] = useCookies(['access_token']);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (cookies.access_token) {
      const decodedToken = JSON.parse(atob(cookies.access_token.split('.')[1]));
      setUserId(decodedToken.id);
      setUserEmail(decodedToken.email);
    }
  }, [cookies.access_token]);

  return (
    <UserContext.Provider value={{ userId, setUserId, userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
