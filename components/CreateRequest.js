import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Alert from "react-bootstrap/Alert"
import { useState, useRef } from "react"
import { ethers } from "ethers"

import { getCustomContract } from "../src/utils/contract"
import styles from "../styles/create-request.module.css"
import getProvider from "../src/utils/provider"
import { saveRequest } from "../config/database"

export default function CreateRequest(props) {
  const [description, setDescription] = useState("");
  const [requestValue, setRequestValue] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [error, setError] = useState("");

  const [isDisabled, setIsDisabled] = useState(true);

  function handleDescriptionUpdate({target: {value}}) {
    setDescription(value);

    if (!value) {
      setIsDisabled(true);
      return;
    }

    if (description.length <= 15) {
      setIsDisabled(true);
      return;
    }

    if (requestValue && recipientAddress) {
      setIsDisabled(false);
    }
  }

  function handleValueUpdate({target: {value}}) {
    setRequestValue(value);

    if (!value) {
      setIsDisabled(true);
      return;
    }

    if (isNaN(value)) {
      setIsDisabled(true);
      return;
    }

    if (description && recipientAddress) {
      setIsDisabled(false);
    }
  }

  function handleRecipientAdressUpdate({target: {value}}) {
    setRecipientAddress(value);
    if (!value) {
      setIsDisabled(true);
      return;
    }

    if (description && requestValue) {
      setIsDisabled(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ethers.utils.isAddress(recipientAddress)) {
      setError("Invalid Recipient Address");
      return;
    }
    const contract = getCustomContract(props.data.campaignAddress);
    try {
      props.data.hide();
      props.data.showLoading();
      props.data.setLoadingScreenText("Please approve request");
      const options = { gasLimit: "1000000"};
      const tx = await contract.createRequest(description, requestValue, recipientAddress, options);

      props.data.setLoadingScreenText("Creating Request. Please wait.");

      const provider = getProvider();
      await provider.waitForTransaction(tx.hash, 1, 150000);
      props.data.hideLoading();

      const data = { description, requestValue, recipientAddress };
      saveRequest(props.data.campaignAddress, data);
    } catch (error) {
      props.data.handleError(error);
    }
  }

  return (
    <Modal show={props.data.visible} onHide={props.data.hide}>
    {error && <Alert variant="danger">{error}</Alert>}
      <Form className={styles.container} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Request description</Form.Label>
          <Form.Control value={description} onChange={handleDescriptionUpdate} as="textarea" rows={4} placeholder="Description" ></Form.Control>
          <Form.Text muted>A minimum description of 15 characters</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Request amount</Form.Label>
          <Form.Control value={requestValue} onChange={handleValueUpdate}placeholder="Value" ></Form.Control>
          <Form.Text muted>Specify value in gwei</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Recipeint address</Form.Label>
          <Form.Control value={recipientAddress} onChange={handleRecipientAdressUpdate}placeholder="Value" ></Form.Control>
          <Form.Text muted>Specify value in gwei</Form.Text>
        </Form.Group>
        <Button disabled={isDisabled} type="submit">Create Request</Button>
      </Form>
    </Modal>
  )
}
