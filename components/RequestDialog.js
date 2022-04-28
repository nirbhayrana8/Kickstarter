import Modal from  "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

export default function RequestDialog({ requests, data, params }) {

	const [selectedRequest, setSelectedRequest] = useState({});
	const [description, setDescription] = useState("");
	const [requestedValue, setRequestedValue] = useState("");
	const [recipientAddress, setRecipientAddress] = useState("");

	const [selectedRequestKey, setSelectedRequestKey] = useState("");
	const [isDisabled, setIsDisabled] = useState(true);

	useEffect(() => {
		if (requests && requests.length > 0) {
			setIsDisabled(false);
			setDescription(requests[0].description);
			setRequestedValue(requests[0].requestValue);
			setRecipientAddress(requests[0].recipientAddress);
			setSelectedRequestKey(requests[0].key);
		}
	}, []);

	useEffect(() => {
		if (requests) {
			const currentRequest = requests.filter(request => request.key === selectedRequestKey);
			if (currentRequest.length > 0) {
				setDescription(currentRequest[0].description);
				setRequestedValue(currentRequest[0].requestValue);
				setRecipientAddress(currentRequest[0].recipientAddress);
			}
		}
	}, [selectedRequest]);

	const handleRequestSelected = ({ target }) => {
		const { options: { selectedIndex } } = target;
		setSelectedRequestKey(target.options[selectedIndex].getAttribute('data-key'));
		setSelectedRequest(target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		params.submit(selectedRequestKey);
	}

  return (
	  <Modal show={data.visible} onHide={data.hide}>
		  <Modal.Header>
			  <h3>{params.heading}</h3>
		  </Modal.Header>
		  <Modal.Body>
			  <Form onSubmit={handleSubmit}>
				  <Form.Group className="mb-3">
					  <Form.Label>Select the request</Form.Label>
					  <Form.Select value={selectedRequest}
					  onChange={handleRequestSelected}>
						  {requests ? requests.map((req) =>
							<option key={req.key} data-key={req.key}>
								{req.description}
							</option>
						  ) : null}
					  </Form.Select>
				  </Form.Group>
				  <Form.Group className="mb-3">
					  <Form.Label>Description</Form.Label>
					  <Form.Control value={description} as="textarea" rows={3} plaintext readOnly />
				  </Form.Group>
				  <Form.Group className="mb-3">
					  <Form.Label>Requested Value</Form.Label>
					  <Form.Control value={requestedValue} plaintext readOnly/>
				  </Form.Group>
				  <Form.Group className="mb-3">
					  <Form.Label>Recipient Address</Form.Label>
					  <Form.Control value={recipientAddress} plaintext readOnly/>
				  </Form.Group>
				  <Button disabled={isDisabled} type="submit">{params.buttonText}</Button>
			  </Form>
		  </Modal.Body>
	  </Modal>

  )
}
