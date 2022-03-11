import React, { useContext, useState, useEffect } from "react";
import firebase from "../config/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const auth = firebase.auth;

  function login(email, password) {
    firebase.methods.signInWithEmailAndPassword(auth, email, password);
  }

  function signup(email, password) {
    firebase.methods.createUserWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    firebase.methods.sendPasswordResetEmail(auth, email);
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
