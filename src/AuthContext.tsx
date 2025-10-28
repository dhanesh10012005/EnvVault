import { createContext, useContext, useState, useEffect } from "react";
import API from "./apiClient.tsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); 
    if (storedToken) {
      setToken(storedToken);

      API.get("/auth/me")
        .then((res) => {
          setCurrentUser(res.data.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { user, token } = res.data.data;

      setCurrentUser(user);
      setToken(token);
      localStorage.setItem("token", token);

      toast.success("Login successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (name, email, password) => {
  console.log("jfoo")
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return;
  }
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      const { user, token } = res.data.data;
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      toast.success("Signup successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // Google login
const loginWithGoogle = async (idToken) => {
  try {
    const res = await API.post("/auth/google", { idToken });

   
    const { user, token } = res.data.data;

    setCurrentUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    toast.success("Google login successful");

  } catch (error) {
    console.error("Google login error:", error);
    toast.error(error.response?.data?.message || "Google login failed");
  }
};


  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logged out");
  };

  const value = {
    currentUser,
    token,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};