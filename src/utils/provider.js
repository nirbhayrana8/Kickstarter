import { ethers } from "ethers";

export default function getProvider() {
	const ethereum = window.ethereum;

	if (!ethereum) {
		console.log("MetaMask is not available");
		return;
	}

	return  new ethers.providers.Web3Provider(ethereum);
};
