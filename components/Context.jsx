import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Context called");
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedRole = await AsyncStorage.getItem('userRole');
        
        console.log(storedUserId, "UserId from AsyncStorage");
        
        if (storedUserId) {
          setUserId(storedUserId);
          setUserEmail(storedEmail);
          setUserRole(storedRole);
        }
      } catch (error) {
        console.error('Error fetching user data from storage:', error);
      }
    };
    
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      console.log(userId, "Updated Id");
      console.log(userEmail, "Updated");
      console.log(userRole, "Updated");
    }
  }, [userId]); // This will log when the state `userId` updates

  const clearUserData = async () => {
    await AsyncStorage.clear();
    // Fixed variable names to match your state variables
    setUserEmail(null);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <UserContext.Provider value={{ userId, userRole, userEmail, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};