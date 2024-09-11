import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const TOKEN_KEY = "token";
const API_URL = "http://localhost:8000";
const AuthContext = createContext<AuthProps>({});

const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  useEffect(() => {
    const loadToken = async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log(token);
        if(token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setAuthState({ token, authenticated: true });
        }
    };
    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    try { 
        const response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        return error;
    }
  }
  const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        });
        await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
        setAuthState({ token: response.data.token, authenticated: true });
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        return response.data;
    } catch (error) {
        return error;
    }
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({ token: null, authenticated: false });
    axios.defaults.headers.common["Authorization"] = '';
}

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
