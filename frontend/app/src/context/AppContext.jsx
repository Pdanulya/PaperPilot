import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, userAPI } from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  // token is read from localStorage on mount so refreshes don't log users out
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }

  // Keep localStorage in sync whenever token changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      setToken(data.access_token);
      
      setTimeout(async () => {
        await fetchMe();
      }, 0);

      return true;
    } catch (err) {
      throw err;
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    try {
      const data = await userAPI.me();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };
  
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await authAPI.register({ name, email, password });
      // showToast("Account created! Please log in.", "success");
      return true;
    } catch (err) {
      // showToast(err.message, "error");
      throw err;
      // return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  // Auto-dismiss toast after 3 seconds
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <AppContext.Provider
    value={{
      user,
      token,
      loading,
      toast,
      login,
      register,
      logout,
      showToast,
      fetchMe
    }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook so components don't need to import useContext + AppContext
export const useApp = () => useContext(AppContext);