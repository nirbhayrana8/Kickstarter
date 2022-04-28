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
import Vote from "../../../components/Vote";
import FinaliseRequest from "../../../components/FinaliseRequest";

export const getServerSideProps = async (context) => {
  const { id: campaignAddress } = context.query;
  let data = await getCampaignData(campaignAddress);

  let requests = null;
  let investors = null;

  if (data.requests) {
    const keys = Object.keys(data.requests);
    requests = Object.values(data.requests);
    requests.map((request, index) => request.key = keys[index]);
  }

  if (data.investors) {
    investors = Object.values(data.investors);
  }
  data = {...data, requests, investors, campaignAddress};
  return { props: { data } }
}

export default function Campaign({ data }) {

  const [walletAccount, setWalletAccount] = useState(null);
  const [informationModalData, setInformationModalData] = useState({});

  const [createRequestData, setCreateRequestData] = useState({});
  const [requestDialogData, setRequestDialogData] = useState({});
  const [finaliseDialogData, setFinaliseDialogData] = useState({});
  const [investData, setInvestData] = useState({});

	const [screenText, setScreenText] = useState("");
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(false);

  const [isCreator, setIsCreator] = useState(false);
  const [isInvestor, setIsInvestor] = useState(false);

  const { currentUser } = useAuth();
  const router = useRouter();

  const showModal = () => { setInvestData((prev) => ({...prev, visible: true})); }
  const closeModal = () => { setInvestData((prev) => ({...prev, visible: false})); }

  const showLoadingScreen = () => { setIsLoadingScreenVisible(true); }
  const hideLoadingScreen = () => { setIsLoadingScreenVisible(false); }

  const showVotingDialog = () => {
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
    setRequestDialogData((prev) => ({...prev, visible: true}));
  }
  const hideVotingDialog = () => { setRequestDialogData((prev) => ({...prev, visible: false})); }

  const hideFinaliseDialog = () => { setFinaliseDialogData((prev) => ({...prev, visible: false})) }

  const closeInformationModal = () => {
    setInformationModalData((prev) => ({...prev, visible: false}));
  }

  const init = async () => {
		let account = await checkWalletIsConnected();
		if (account) {
			setWalletAccount(account);
    }
	}

  const handleError = (error) => {
    hideLoadingScreen();
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
      closeModal();
      setInformationModalData({
        visible: true,
        title: "Transaction Failed",
        content: "Insufficient balance to complete transaction",
        buttonText: "Continue",
        submit: closeInformationModal
      });
    } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {

    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    init();

    if (currentUser.uid === data.creatorUID) {
      setIsCreator(true);
    }

    if (data.investors && data.investors.includes(currentUser.uid)) {
      setIsInvestor(true);
    }

    setInvestData({
      minimumValue: data.meta.minimumValue
    });

    setCreateRequestData({
      visible: false,
      campaignAddress: data.campaignAddress,
      hide: hideCreateRequest,
      showLoading: showLoadingScreen,
      hideLoading: hideLoadingScreen,
      setLoadingScreenText: setScreenText,
      handleError
    });

    setRequestDialogData({
      hide: hideVotingDialog,
      campaignAddress: data.campaignAddress,
      showLoading: showLoadingScreen,
      hideLoading: hideLoadingScreen,
      setLoadingScreenText: setScreenText,
      handleError
    });

    setFinaliseDialogData({
      hide: hideFinaliseDialog,
      campaignAddress: data.campaignAddress,
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

    if (isInvestor) {
      setRequestDialogData((prev) => ({ ...prev, address: data.campaignAddress }))
    }
  }, [walletAccount, isInvestor]);

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
    const contract = getCustomContract(data.campaignAddress);

    setScreenText("Please approve request");
    try {
      const options = { value:  ethers.utils.parseUnits(contributionAmount, "gwei")}
      let tx = await contract.contribute(options);

      // Blocks until transaction complete
      setScreenText("Investing in campaign...");
      const provider = getProvider();
      await provider.waitForTransaction(tx.hash, 1, 150000);
      saveInvestor(data.campaignAddress, currentUser.uid);

    } catch (error) {
      handleError(error);
    }
    setIsLoadingScreenVisible(false);
  }

  const hideCreateRequest = () => { setCreateRequestData((prev) => ({...prev, visible: false})) }

  const openFinaliseRequestDialog = () => {
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
    setFinaliseDialogData((prev) => ({...prev, visible: true}));
  }

  const openCreateRequestDialog = () => {
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
    <Vote requests={data.requests} data={requestDialogData}/>
    <FinaliseRequest requests={data.requests} data={finaliseDialogData}/>
    <div className={styles.container}>
      <Card className={styles.card}>
        <Card.Body>
        <h1>{data.name}</h1>
        <hr />
        <h5>{data.meta.description}</h5>
        <p>{data.meta.minimumValue}</p>
        {isCreator ? (
          <div className="button_container">
            <Button onClick={openCreateRequestDialog} className="m-4">Create Request</Button>

            <Button onClick={openFinaliseRequestDialog} className="m-4">Finalise Request</Button>
          </div>
          ) :
          isInvestor ? (
              <Button onClick={showVotingDialog}>Vote</Button>
              )
           :
          <>
            <InvestInCampaign
              data={investData}
              modalClose={closeModal}
              />
            <Button onClick={showModal}>Invest</Button>
          </>
          }
        </Card.Body>
      </Card>
    </div>
  </>
  )
}

