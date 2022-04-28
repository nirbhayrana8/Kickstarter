import RequestDialog from "../components/RequestDialog"

import { getCustomContract } from "../src/utils/contract"
import getProvider from "../src/utils/provider"

export default function FinaliseRequest({ requests, data }) {

	const executeTransaction = async (selectedRequestKey) => {
		const contract = getCustomContract(data.campaignAddress);
		try {
			data.hide();
      		data.showLoading();
      		data.setLoadingScreenText("Please approve request");
			  let requestIndex = null;
			  requests.forEach((req, index) => {
				if (req.key === selectedRequestKey) {
					requestIndex = index;
				}
			});
			const options = { gasLimit: "100000" }
			const tx = await contract.finaliseRequest(requestIndex, options);
			data.setLoadingScreenText("Finalising request. Please wait.");

			const provider = getProvider();
			await provider.waitForTransaction(tx.hash, 1, 150000);
			data.hideLoading();

		} catch (error) {
			data.handleError(error);
		}
	}

	const params = {
		heading: "Finalise request",
		buttonText: "Finalise",
		submit: executeTransaction
	}

  return (
	<RequestDialog requests={requests} data={data} params={params}/>
  )
}
