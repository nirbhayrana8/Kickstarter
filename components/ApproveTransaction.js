import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button"

export default function TransactionStatus(props) {

  return (
	<>
		<Modal show={props.show} onHide={props.modalClose} backdrop={props.backdrop} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.content}</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={props.connectWallet}>
            {props.buttonText}
          </Button>
        </Modal.Footer>
      </Modal>
	</>
  )
}
