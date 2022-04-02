import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"
import { ethers } from "ethers";

import styles from "../../styles/new-campaign.module.css"

import { saveCreatedCampaign } from "../../config/database"
import { checkWalletIsConnected, connectWalletHandler } from "../../src/utils/config"
import { useAuth } from "../../contexts/AuthContext"
import { useTransaction } from "../../contexts/TransactionContext"
import getContract from "../../src/utils/contract"
import getProvider from "../../src/utils/provider"
import ProtectedRoute from "../../components/ProtectedRoute"
import PopUpDialog from "../../components/PopUpDialog"
import LoadingScreen from "../../components/LoadingScreen"

const MINIMUM_NAME_LENGTH = 3;
const MINIMUM_DESCRIPTION_LENGTH = 30;

export default function NewCampaign() {
	const [walletAccount, setWalletAccount] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [screenText, setScreenText] = useState("");

	const [modalData, setModalData] = useState({});
	const { currentUser } = useAuth();

	const nameRef = useRef();
	const descriptionRef = useRef();
	const minValueRef = useRef();

	const contract = getContract();

	const closeModal = () => { setModalData((prev) =>  ({ ...prev, visible: false })); }

	const init = async () => {
		let account = await checkWalletIsConnected();
		if (!account) {
			setModalData({
				visible: true,
				title: "Connect wallet handler",
				content: "Please ensure a wallet handler is installed to continue.",
				buttonText: "Connect",
				submit: setEthereumAccount
			});
		} else {
			setWalletAccount(account);
		}
	}

	const { lastTransaction, updateTransaction } = useTransaction();

	useEffect(() => {

		if (!contract) {
			setModalData({
				visible: true,
				title: "Connect wallet handler",
				content: "Please ensure a wallet handler is installed to continue.",
				buttonText: "Connect",
				submit: setEthereumAccount
			});
			return;
		}

		init();

		const filter = contract.filters.CampaignCreated(walletAccount);

		const eventListner = (creator, createdCampaign, timeCreated) => {
			let d = new Date(timeCreated * 1000);
			let time = d.toUTCString();
			const metaData = {
				"createdAt": time,
				"name": nameRef.current.value,
				"description": descriptionRef.current.value,
				"minimumValue": minValueRef.current.value,
				"raisedValue": 0
			}
			if (lastTransaction === createdCampaign) {
				return;
			}
			saveCreatedCampaign(currentUser, creator, createdCampaign, metaData);
			updateTransaction(createdCampaign);
			console.log(`creator: ${creator}, address: ${createdCampaign}, timeCreated: ${time}`);
		};

		const provider = getProvider();
		provider.once("block", () => {
			contract.on(filter, eventListner);
		});

		return () => {
			contract.removeListener(filter, eventListner);
		}
	}, []);

	useEffect(() => {
		if (modalData.visible) { closeModal(); }

	}, [walletAccount]);

	async function setEthereumAccount() {
		let account = await connectWalletHandler();
    	setWalletAccount(account);
	}

	async function createCampaign(e) {
		e.preventDefault();
		setError("");

		if (!walletAccount) {
			setModalData({
				visible: true,
				title: "Connect wallet handler",
				content: "Please ensure a wallet handler is installed to continue.",
				buttonText: "Connect",
				submit: setEthereumAccount
			});
			return;
		}

		let name = nameRef.current.value.trim();
		let description = descriptionRef.current.value.trim();
		let minimumValue = minValueRef.current.value;

		if (name.length < MINIMUM_NAME_LENGTH) {
			setError("Name must be greater than 3 characters");
			return;
		}

		if (description.length < MINIMUM_DESCRIPTION_LENGTH) {
			setError("Description must be greater than 30 characters");
			return;
		}

		if (isNaN(minimumValue)) {
			setError("Minimum value must be a number");
			return;
		}

		let gasEstimate = await contract.estimateGas.createCampaign(minimumValue);
		gasEstimate = parseInt(gasEstimate.toString());
		let gasPrice = await getProvider().getGasPrice();
		gasPrice = parseInt(ethers.utils.formatUnits(gasPrice, "gwei"));

		setModalData({
			visible: true,
			title: "Confirm Transaction",
			backdrop: "static",
			content: `Name: ${name} \nMinimum Donation Value: ${minimumValue} \nEstimated Cost: ${gasEstimate * gasPrice} gwei`,
			buttonText: "Confirm",
			submit: executeTransaction
		});
	}

	const executeTransaction = async () => {
		closeModal();
		const provider = getProvider();
		try {
			setLoading(true);

			setScreenText("Please approve request");
			let tx = await contract.createCampaign(minValueRef.current.value);

			// Blocks until transaction complete
			setScreenText("Creating your campaign...");
			await provider.waitForTransaction(tx.hash, 1, 150000);

		} catch (error) {
			if (error.code === 4001) {
				closeModal();
				setModalData({
					visible: true,
					title: "Transaction Failed",
					content: "The transaction was cancelled.",
					buttonText: "Continue",
					submit: closeModal
				});
			} else {
				console.log(error);
			}
		}
		setLoading(false);
	}

	const router = useRouter();
	function handleBackClicked() {
	  router.back();
   }
	return (
		<ProtectedRoute>
		<PopUpDialog
		 modalClose={closeModal}
		 data={modalData} />
		 <LoadingScreen loading={loading} text={screenText}/>
			<div className={styles.card}>
				<Card>
				<Card.Header>
					<Card.Title className="text-center">Start a new campaign</Card.Title>
				</Card.Header>

				<Card.Body>
				{error && <Alert variant="danger">{error}</Alert>}
					<Form style={{border: "none"}} onSubmit={createCampaign}>
						<Form.Group className="mb-3">
							<Form.Label>Name your campaign</Form.Label>
							<Form.Control ref={nameRef} required type="text" placeholder="Enter the name" />
							<Form.Text className="text-muted">
								Everyone loves a memorable name.
							</Form.Text>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Description</Form.Label>
							<Form.Control ref={descriptionRef} required as="textarea" rows={4} placeholder="Description" />
							<Form.Text className="text-muted">
								A short summary of why your idea is worth the investment.
							</Form.Text>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Minimum Contribution</Form.Label>
							<Form.Control ref={minValueRef} required type="text" placeholder="Value in ether" />
							<Form.Text className="text-muted">
								The minimum amount to be considered an investor.
							</Form.Text>
						</Form.Group>
						<div className={styles.submit}>
							<Button variant="outline-secondary" className={`btn-lg ${styles.button}`}
							onClick={handleBackClicked}>
								Back
							</Button>
							<Button disabled={loading} variant="primary" type="submit" className={`btn-lg ${styles.button}`}>
								Create
							</Button>
						</div>
					</Form>
				</Card.Body>
				</Card>
			</div>
		</ProtectedRoute>
	);
}