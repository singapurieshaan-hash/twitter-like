import { createContext, useContext, useState, useEffect } from "react";
import api, { setToken } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

const STORAGE_KEY = "chirpUser";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // `loading` covers the initial "am I still logged in?" check on page load.
  const [loading, setLoading] = useState(true);

  // On first load, restore the session from localStorage so a refresh keeps
  // the user logged in.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setToken(parsed.token);
      connectSocket(parsed.token);
      setUser(parsed);
      // Verify the token is still valid by fetching the current user.
      api
        .get("/users/me")
        .then((res) => setUser({ ...parsed, ...res.data }))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/login", { username, password });
    persist(res.data);
    return res.data;
  };

  const signup = async (details) => {
    // Create the account, then log in with the same credentials.
    await api.post("/users", details);
    return login(details.username, details.password);
  };

  const persist = (data) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setToken(data.token);
    connectSocket(data.token);
    setUser(data);
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    disconnectSocket();
    setUser(null);
  };

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Convenience hook.
export const useAuth = () => useContext(AuthContext);
