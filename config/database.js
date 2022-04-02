import { set, get, update, push, ref, onValue } from "firebase/database"
import firebase from "./firebase"

const db = firebase.db;

export const saveUser = async (user) => {
	try {
		let unixTimeStamp = Date.now();
		let d = new Date(unixTimeStamp * 1000);
		let time = d.toUTCString();
		await set(ref(db, `users/${user}`), {
			"createdAt": time
		});
	} catch (error) {
		console.log(error)
	}
};


export const saveCreatedCampaign = async (user, creator, address, metaData) => {
	try {
		const userRef = ref(db, `users/${user.uid}/createdCampaigns`);
		await push(userRef, address);

		const campaignsRef = ref(db, `campaigns/${address}`);
		const {name, ...meta} = metaData;
		await set(campaignsRef, {
			"name": name,
			"creatorUID": user.uid,
			"creatorAddress": creator,
			"active": true,
			"meta": meta
		});

	} catch (error) {
		console.log(error)
	}
}

export const getCampaignData = async (campaign) => {
	let data = null;
	const campaignRef = ref(db, `campaigns/${campaign}`);
	try {
		const snapshot = await get(campaignRef);

		if (snapshot.exists()) {
			data = snapshot.val();
		} else {
			console.log("Value does not exist");
		}
	} catch (error) {
		console.log(error);
	}
	return data;
}

export const saveInvestor = async (campaignAddress, investor) => {
	const userRef = ref(db, `users/${investor}/investedIn`);
	const campaignInvestorRef = ref(db, `campaigns/${campaignAddress}/investors`);
	try {
		await push(userRef, campaignAddress);
		await push(campaignInvestorRef, investor);
	} catch (error) {
		console.log(error);
	}
};

export const saveRequest = async (campaignAddress, data) => {
	const campaignInvestorRef = ref(db, `campaigns/${campaignAddress}/requests`);
	try {
		await push(campaignInvestorRef, data);
	} catch (error) {
		console.log(error);
	}
};

