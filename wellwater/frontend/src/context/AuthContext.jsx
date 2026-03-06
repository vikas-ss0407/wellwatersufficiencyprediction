import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login, logout, signup, subscribeToAuthChanges } from "../api/authApi";

const AuthContext = createContext(null);
const PASSWORD_STORAGE_KEY = "ww_user_password";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      const storedPassword = sessionStorage.getItem(PASSWORD_STORAGE_KEY) || "";
      setUser(
        firebaseUser
          ? {
              ...firebaseUser,
              password: storedPassword
            }
          : null
      );
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signupUser = async (payload) => {
    const createdUser = await signup(payload);
    const password = payload?.password || "";
    sessionStorage.setItem(PASSWORD_STORAGE_KEY, password);
    const enrichedUser = { ...createdUser, password };
    setUser(enrichedUser);
    return enrichedUser;
  };

  const loginUser = async (payload) => {
    const loggedInUser = await login(payload);
    const password = payload?.password || "";
    sessionStorage.setItem(PASSWORD_STORAGE_KEY, password);
    const enrichedUser = { ...loggedInUser, password };
    setUser(enrichedUser);
    return enrichedUser;
  };

  const logoutUser = async () => {
    await logout();
    sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      isAuthenticated: Boolean(user),
      signupUser,
      loginUser,
      logoutUser
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
