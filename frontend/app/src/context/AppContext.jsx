import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

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
      // Decode basic user info from token payload (no sensitive data)
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      setUser({ email, id: payload.sub });
      showToast("Welcome back!", "success");
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      await authAPI.register({ email, password });
      showToast("Account created! Please log in.", "success");
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
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
      value={{ user, token, loading, toast, login, register, logout, showToast }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook so components don't need to import useContext + AppContext
export const useApp = () => useContext(AppContext);