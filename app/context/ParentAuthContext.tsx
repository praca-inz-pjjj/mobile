import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
export const API_URL = "http://192.168.1.86:8000";
const AuthContext = createContext<AuthProps>({});

export const useParentAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: any) {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  useEffect(() => {
    // left for now
    // const loadToken = async () => {
    //   const token = await SecureStore.getItemAsync(TOKEN_KEY);
    //   console.log(`token: ${token}`);
    //   if (token) {
    //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //     setAuthState({ token, authenticated: true });
    //   }
    // };
    // loadToken();
    // try {
    //   SecureStore.deleteItemAsync(TOKEN_KEY);
    //   SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    // } catch (error) {
    //   console.log(error);
    // }
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
  };

  const login = async (email: string, password: string) => {
    const user = {
      email,
      password,
    };
    try {
      const response = await axios.post(`${API_URL}/parent/token`, user, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 200) {
        console.log(response);
        return { error: response };
      }
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.access);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refresh);
      setAuthState({ token: response.data.access, authenticated: true });
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access}`;
      return response.data;
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({ token: null, authenticated: false });
    axios.defaults.headers.common["Authorization"] = "";
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
