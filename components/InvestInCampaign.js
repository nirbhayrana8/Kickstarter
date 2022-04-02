import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useState, useRef } from "react";

import styles from "../styles/invest-campaign.module.css"

export default function InvestInCampaign(props) {

	const [executingTransaction, setExecutingTransaction] = useState(false);
	const [error, setError] = useState("");

	const { minimumValue } = props.data;

	const valueRef = useRef();

	const handleSubmit = () => {
		setError("");
		const contribution = parseInt(valueRef.current.value);
		if (!contribution) {
			setError("Value cannot be empty");
			return;
		}

		if (contribution < minimumValue) {
			setError(`Contribution cannot be less than ${minimumValue} wei`);
			return;
		}
		props.data.investInCampaign(contribution.toString());
	}


  	return (
			<Modal show={props.data.visible} onHide={props.modalClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>Invest in Campaign</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Become an investor by contibuting a minimum amount of {minimumValue} wei
				</Modal.Body>
				{error && <Alert variant="danger">{error}</Alert>}
				<Modal.Footer className={styles.footer}>
					<Form>
						<Form.Control ref={valueRef} type="number" min={minimumValue} required placeholder="Enter value in gwei"></Form.Control>
					</Form>
					<Button disabled={executingTransaction} variant="success" onClick={handleSubmit}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
  	)
}