import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Updated to import jwtDecode correctly
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AuthContextProps {
  user: UserProps | null;
  authTokens: AuthTokensProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  setAuthToken: React.Dispatch<React.SetStateAction<AuthTokensProps | null>>;
  loginUser: (email: string, password: string) => Promise<void>;
  signUpUser: (
    username: string,
    gender: string,
    email: string,
    password: string,
    confirm_password: string
  ) => Promise<void>;
  logoutUser: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (uidb64: string, token: string) => Promise<void>;
  resetPassword: (
    uidb64: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  requestVerificationResend: (email: string) => Promise<void>;
}

interface UserProps {
  email: string;
  username: string;
  is_verified: boolean;
  user_id: number;
  exp: number; 
}

interface AuthTokensProps {
  access: string; 
  refresh: string; 
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export default AuthContext;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authTokens, setAuthToken] = useState<AuthTokensProps | null>(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens') as string)
      : null
  );
  const [user, setUser] = useState<UserProps | null>(() =>
    authTokens ? jwtDecode<UserProps>(authTokens.access) : null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        email,
        password,
      });
  
      if (response.status === 200) {
        const tokens = response.data;
        const decodedToken = jwtDecode<UserProps>(tokens.access);
  
        // Check if user is verified
        if (!decodedToken.is_verified) {
          toast.error('Your account is not activated. Please verify your email.');
          return;
        }else{
             // Proceed if verified
          // toast.success('Account activated successfully. You can now log in!');
          localStorage.setItem('authTokens', JSON.stringify(tokens));
          
          setAuthToken(tokens);
          setUser(decodedToken);
          navigate('/dashboard');
          toast.success('Login Successful');
        }
  
       
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Invalid credentials');
      } else {
        console.log(error);
        toast.error('An error occurred during login');
      }
    }
  };

  const signUpUser = async (
    username: string,
    gender: string,
    email: string,
    password: string,
    confirm_password: string
  ) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/signup/',
        { username, email, gender, password, confirm_password }
      );
      if (response.status === 201) {
        toast.success('Registration successful. Please check your email to activate your account.');
        // Optionally navigate to login page if needed
        // navigate('/login'); // Uncomment if you want to navigate immediately
      } else {
        toast.error('Registration failed');
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred during registration');
    }
  };

  const logoutUser = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
    toast.success('Logged Out Successfully');
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/forgot-password/', {
        email,
      });
      toast.success('Reset Password link has been sent to your email');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred during password reset');
    }
  };

  const resetPassword = async (
    uidb64: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/reset-password/${uidb64}/${token}/`,
        { password: newPassword, confirm_password: confirmPassword }
      );

      if (response.status === 200) {
        toast.success('Password reset successful! You can now log in with your new password.');
        navigate('/login'); // Navigate to login page after successful reset
      } else {
        toast.error('Password reset failed!');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred during the password reset process.');
    }
  };

  const verifyEmail = async (uidb64: string, token: string) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/verify-email/${uidb64}/${token}/`,
        { uidb64, token }
      );
      if (response.status === 200) {
        toast.success('Account activated successfully. You can now log in!');
        navigate('/login'); // Redirect to login page
      } else {
        toast.error('Email verification failed');
        throw new Error('Email verification failed');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred during email verification');
    }
  };

  const requestVerificationResend = async (email: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/resend-verification/', { email });
      if (response.status === 200) {
        toast.success('Verification link has been sent to your email.');
      } else {
        toast.error('Failed to resend verification link.');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while requesting a new verification link.');
    }
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode<UserProps>(authTokens.access));
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ user, authTokens, setAuthToken, setUser, loginUser, signUpUser, logoutUser, forgotPassword, verifyEmail, resetPassword, requestVerificationResend }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
