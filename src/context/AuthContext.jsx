import { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange, checkSessionValidity } from "../firebase/auth";
import { getUserDocument } from "../firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const isValid = await checkSessionValidity();
        if (!isValid) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        const userData = await getUserDocument(firebaseUser.uid);
        if (userData) {
          setUser({ ...userData, uid: firebaseUser.uid, email: firebaseUser.email });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Check session validity every 10 minutes
    const interval = setInterval(async () => {
      const isValid = await checkSessionValidity();
      if (!isValid) {
        setUser(null);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.uid]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
