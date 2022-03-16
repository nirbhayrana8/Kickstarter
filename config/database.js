import { set, get, update, ref } from "firebase/database"

import firebase from "./firebase"
import useAuth from "../contexts/AuthContext"

const { currentUser } = useAuth();
const { db } = firebase;

export const saveUser = async () => {
	const userId = currentUser.uid;
	const userRef = ref(db, `users/${userId}`);
	set(userRef);
};
