import React, { useContext, useState, useEffect } from "react";
import firebase from "../config/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = firebase.auth;

  async function login(email, password) {
    await firebase.methods.signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email, password) {
    await firebase.methods.createUserWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return await auth.signOut();
  }

  async function resetPassword(email) {
    await firebase.methods.sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    loading,
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
