import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import InvestInCampaign from "../../../components/InvestInCampaign"
import LoadingScreen from "../../../components/LoadingScreen";
import PopUpDialog from "../../../components/PopUpDialog"
import { ethers } from "ethers";

import { getCampaignData } from "../../../config/database";
import { useAuth } from "../../../contexts/AuthContext"
import { saveInvestor } from "../../../config/database"
import styles from "../../../styles/campaign-details.module.css"
import getProvider from "../../../src/utils/provider"
import { getCustomContract } from "../../../src/utils/contract"
import { checkWalletIsConnected, connectWalletHandler } from "../../../src/utils/config"
import CreateRequest from "../../../components/CreateRequest";
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {
  const { id: campaignAddress } = context.query;
  const data = await getCampaignData(campaignAddress);
  return { props: { data, campaignAddress } }
}

export default function Campaign({ data, campaignAddress }) {

  //1. Check if person opening page is creator, investor, or none of the above.
  //2.a. Render create request, finalise request if creator
  //2.b. Render vote if investor.
  //2.c. Render invest if none of above.
  //3. Build voting and create request pages

  const [walletAccount, setWalletAccount] = useState(null);
  const [informationModalData, setInformationModalData] = useState({});
  const [createRequestData, setCreateRequestData] = useState({});

  const [investData, setInvestData] = useState({});
	const [screenText, setScreenText] = useState("");
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(false);

  const { currentUser } = useAuth();
  const router = useRouter();

  const showModal = () => { setInvestData((prev) => ({...prev, visible: true})); }
  const closeModal = () => { setInvestData((prev) => ({...prev, visible: false})); }

  const showLoadingScreen = () => { setIsLoadingScreenVisible(true); }
  const hideLoadingScreen = () => { setIsLoadingScreenVisible(false); }

  const closeInformationModal = () => {
    setInformationModalData((prev) => ({...prev, visible: false}));
  }

  let isCreator = false;
  if (currentUser) {
    isCreator = currentUser.uid === data.creatorUID;
  }

  const init = async () => {
		let account = await checkWalletIsConnected();
		if (account) {
			setWalletAccount(account);
    }
	}

  const handleError = (error) => {
    if (error.code === 4001) {
      closeModal();
      setInformationModalData({
        visible: true,
        title: "Transaction Failed",
        content: "The transaction was cancelled.",
        buttonText: "Continue",
        submit: closeInformationModal
      });
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      console.log(error.error.message)
      closeModal();
      setInformationModalData({
        visible: true,
        title: "Transaction Failed",
        content: "Insufficient balance to complete transaction",
        buttonText: "Continue",
        submit: closeInformationModal
      });
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    init();
    setInvestData({
      minimumValue: data.meta.minimumValue
    });

    setCreateRequestData({
      visible: false,
      campaignAddress,
      hide: hideCreateRequest,
      showLoading: showLoadingScreen,
      hideLoading: hideLoadingScreen,
      setLoadingScreenText: setScreenText,
      handleError
    })
  }, []);

  useEffect(() => {
    if (informationModalData.visible) {
      closeInformationModal();
    }
    setInvestData((prev) => ({...prev, investInCampaign: invest}));
  }, [walletAccount])

  async function setEthereumAccount() {
		let account = await connectWalletHandler();
    setWalletAccount(account);
	}

  const invest = async (contributionAmount) => {
    closeModal();

    if (!currentUser) {
      setInformationModalData({
        visible: true,
				title: "Login to contintue",
				content: "You need to login to continue.",
				buttonText: "Login",
				submit: () => { router.push("/login") }
      });
      return;
    }

    if (!walletAccount) {
      setInformationModalData({
        visible: true,
				title: "Connect wallet handler",
				content: "Please ensure a wallet handler is installed to continue.",
				buttonText: "Connect",
				submit: setEthereumAccount
      });
      return;
    }

    setIsLoadingScreenVisible(true);
    const contract = getCustomContract(campaignAddress);

    setScreenText("Please approve request");
    try {
      const options = { value:  ethers.utils.parseUnits(contributionAmount, "gwei")}
      let tx = await contract.contribute(options);

      // Blocks until transaction complete
      setScreenText("Investing in campaign...");
      const provider = getProvider();
      await provider.waitForTransaction(tx.hash, 1, 150000);
      saveInvestor(campaignAddress, currentUser.uid);

    } catch (error) {
      handleError(error);
    }
    setIsLoadingScreenVisible(false);
  }

  const hideCreateRequest = () => { setCreateRequestData((prev) => ({...prev, visible: false})) }

  const createRequest = () => {
    if (!walletAccount) {
      setInformationModalData({
        visible: true,
				title: "Connect wallet handler",
				content: "Please ensure a wallet handler is installed to continue.",
				buttonText: "Connect",
				submit: setEthereumAccount
      });
      return;
    }
    setCreateRequestData((prev) => ({...prev, visible: true}));
  }

  return (
    <>
    <PopUpDialog modalClose={closeInformationModal} data={informationModalData}/>
    <LoadingScreen loading={isLoadingScreenVisible} text={screenText} />
    <CreateRequest data={createRequestData}/>
    <div className={styles.container}>
      <Card className={styles.card}>
        <Card.Body>
        <h1>{data.name}</h1>
        <hr />
        <h5>{data.meta.description}</h5>
        <p>{data.meta.minimumValue}</p>
        {isCreator ? (
          <div className="button_container">
            <Button onClick={createRequest} className="m-4">Create Request</Button>

            <Button >Finalise Request</Button>
          </div>
          ) : (
          <div className="invest">
            <InvestInCampaign
              data={investData}
              modalClose={closeModal}
              />
            <Button onClick={showModal}>Invest</Button>
          </div>
          )}
        </Card.Body>
      </Card>
    </div>
  </>
  )
}

