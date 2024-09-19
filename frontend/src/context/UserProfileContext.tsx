import useAxios from "../utils/useAxios";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthContext from "./AuthContext";

// Define the UserProfile type (adjust according to your actual API response structure)
interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  profile_img?: string;
  location: string;
  user: string;
  phone_number: string;
  bio: string;
  gender: string;
}

// Define the context value type
interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  fetchUserProfile: () => Promise<void>;
  // clearUserProfile: () => void;
}

// Create the context with the appropriate type
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider props type
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component
export const UserProvider = ({ children }: UserProviderProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const axiosInstance = useAxios();
  const {authTokens} = useContext(AuthContext)

  // Fetch user profile function
  const fetchUserProfile = async () => {
    if (!authTokens) {
      setUserProfile(null); // Clear profile if no authTokens
      return;
    }
    try {
      const response = await axiosInstance.get("/user/profile/");
      if (response.data && response.data.results.length > 0) {
        setUserProfile(response.data.results[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  useEffect(() => {
    fetchUserProfile();
  }, [authTokens]);

  const contextValues: UserContextType = {
    userProfile,
    setUserProfile,
    fetchUserProfile,
    
  };

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};
