import { set, get, update, ref } from "firebase/database"
import firebase from "./firebase"

const db = firebase.db;

export const saveUser = async (userId) => {
	try {
		set(ref(db, `users/${userId}`), {
			"campaignsCreated": "",
			"investments": "",
		});
	} catch (error) {
		console.log(error)
	}
};
