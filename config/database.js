import { set, get, update, push, ref } from "firebase/database"
import firebase from "./firebase"

const db = firebase.db;

export const saveUser = async (userId) => {
	try {
		let unixTimeStamp = Date.now();
		let d = new Date(unixTimeStamp * 1000);
		let time = d.toUTCString();
		await set(ref(db, `users/${userId}`), {
			"createdAt": time
		});
	} catch (error) {
		console.log(error)
	}
};


export const saveCreatedCampaign = async (user, creator, address, metaData) => {
	try {
		console.log('Fired!!!!!!!!!!!!');
		const userRef = ref(db, `users/${user.uid}/createdCampaigns`);
		await push(userRef, address);

		const campaignsRef = ref(db, `campaigns/${address}`);
		await set(campaignsRef, {
			"creator": creator,
			"active": true,
			"meta": metaData
		});

	} catch (error) {
		console.log(error)
	}
}