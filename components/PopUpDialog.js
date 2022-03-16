import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button"

import styles from "../styles/popup.module.css"

export default function PopUpDialog(props) {

  return (
	<>
		<Modal show={props.data.visible} onHide={props.modalClose} backdrop={props.data.backdrop} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.data.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body><pre className={styles.content}>{props.data.content}</pre></Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={props.data.submit}>
            {props.data.buttonText}
          </Button>
        </Modal.Footer>
      </Modal>
	</>
  )
}
