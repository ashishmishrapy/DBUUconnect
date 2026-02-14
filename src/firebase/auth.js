import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "./config";

// Set persistence to LOCAL (survives browser restart)
setPersistence(auth, browserLocalPersistence);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 60 * 1000; // 10 hours

export const setSessionTimestamp = () => {
  localStorage.setItem('sessionStart', Date.now().toString());
  localStorage.setItem('lastTokenRefresh', Date.now().toString());
};

export const checkSessionValidity = async () => {
  const sessionStart = localStorage.getItem('sessionStart');
  const lastTokenRefresh = localStorage.getItem('lastTokenRefresh');
  
  if (!sessionStart) return false;
  
  const now = Date.now();
  const sessionAge = now - parseInt(sessionStart);
  
  // Check if session expired (1 week)
  if (sessionAge > SESSION_DURATION) {
    await logoutUser();
    localStorage.removeItem('sessionStart');
    localStorage.removeItem('lastTokenRefresh');
    return false;
  }
  
  // Check if token needs refresh (10 hours)
  if (lastTokenRefresh) {
    const tokenAge = now - parseInt(lastTokenRefresh);
    if (tokenAge > TOKEN_REFRESH_INTERVAL) {
      try {
        await auth.currentUser?.getIdToken(true); // Force token refresh
        localStorage.setItem('lastTokenRefresh', Date.now().toString());
      } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
      }
    }
  }
  
  return true;
};

export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  setSessionTimestamp();
  return result;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  setSessionTimestamp();
  return result;
};

export const logoutUser = async () => {
  localStorage.removeItem('sessionStart');
  localStorage.removeItem('lastTokenRefresh');
  return await signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
