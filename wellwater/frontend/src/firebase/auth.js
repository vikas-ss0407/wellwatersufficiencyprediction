import app from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

const auth = getAuth(app);

const mapFirebaseUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.uid,
    fullName: user.displayName || "Farmer",
    email: user.email || ""
  };
};

export const signup = async ({ fullName, email, password }) => {
  const credentials = await createUserWithEmailAndPassword(auth, email, password);

  if (fullName?.trim()) {
    await updateProfile(credentials.user, {
      displayName: fullName.trim()
    });
  }

  return mapFirebaseUser(auth.currentUser);
};

export const login = async ({ email, password }) => {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(credentials.user);
};

export const logout = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUser(user));
  });
};

export { auth };
