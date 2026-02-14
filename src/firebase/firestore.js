import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./config";

export const createUserDocument = async (uid, userData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const getUserDocument = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
};

export const updateUserDocument = async (uid, userData) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: new Date().toISOString(),
  });
};

export const getAllUsers = async () => {
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserByUsername = async (username) => {
  const users = await getAllUsers();
  return users.find(user => user.username === username);
};
