import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [cookies] = useCookies(['access_token']);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      if (cookies.access_token) {
        try {
          const decodedToken = JSON.parse(atob(cookies.access_token.split('.')[1]));
          setUserId(decodedToken.id || null);
          setUserEmail(decodedToken.email || null);
        } catch (error) {
          console.error('Failed to decode token:', error);
          setUserId(null);
          setUserEmail(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [cookies.access_token]);

  return (
    <UserContext.Provider value={{ userId, setUserId, userEmail, setUserEmail, isLoading }}>
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
