import { ethers } from "ethers";
import getProvider from "./provider"
const { abi, networks } = require("../contracts/CampaignFactory.json");

export default function getContract() {
	const signer = getProvider().getSigner();
	return new ethers.Contract(networks["4"].address, abi, signer);
};
