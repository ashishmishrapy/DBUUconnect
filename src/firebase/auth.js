import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "./config";

// Set persistence to LOCAL (survives browser restart)
setPersistence(auth, browserLocalPersistence);

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
};

export const loginUser = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  
  if (!result.user.emailVerified) {
    await signOut(auth);
    throw new Error('Please verify your email before logging in. Check your inbox.');
  }
  
  return result;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
