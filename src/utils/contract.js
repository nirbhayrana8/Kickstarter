import { ethers } from "ethers";
import getProvider from "./provider"
const { abi, networks } = require("../contracts/CampaignFactory.json");
const { abi: createdCampaignABI } = require("../contracts/Campaign.json")

export const getCustomContract = (address) => {
	const provider = getProvider();
	if (!provider) { return null }

	const signer = provider.getSigner();
	return new ethers.Contract(address, createdCampaignABI, signer);
};


export default function getContract() {
	const provider = getProvider();
	if (!provider) { return null }

	const signer = provider.getSigner();
	return new ethers.Contract(networks["4"].address, abi, signer);
};
