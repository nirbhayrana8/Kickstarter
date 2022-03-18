import React, { useContext, useState, useEffect } from "react";
import firebase from "../config/firebase";
import { saveUser } from "../config/database"

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUserCreated, setNewUserCreated] = useState();

  const { auth } = firebase;

  async function login(email, password) {
    await firebase.methods.signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email, password) {
    await firebase.methods.createUserWithEmailAndPassword(auth, email, password);
    setNewUserCreated(true);
  }

  async function logout() {
    return await auth.signOut();
  }

  async function resetPassword(email) {
    await firebase.methods.sendPasswordResetEmail(auth, email);
  }

  //set current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  //Add user to backend
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && newUserCreated) {
        saveUser(user.uid);
      }
    });

    return unsubscribe;
  }, [newUserCreated]);

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
