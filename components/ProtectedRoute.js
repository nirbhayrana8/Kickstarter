import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import Redirect from "./Redirect";

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  return currentUser ? children : <Redirect to="/login" />;
}
