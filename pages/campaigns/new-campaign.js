import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

import {useRouter} from "next/router"

import styles from "../../styles/new-campaign.module.css"

export default function NewCampaign() {
  const router = useRouter();

  function handleBackClicked() {
	  router.back();
  }

  return (
	  <div className={styles.card}>
	  <Card>
		<Card.Header>
			<Card.Title className="text-center">The first step to a new journey</Card.Title>
		</Card.Header>

		<Card.Body>
			<Form style={{border: "none"}}>
				<Form.Group className="mb-3">
					<Form.Label>Name your campaign</Form.Label>
					<Form.Control type="text" placeholder="Enter the name" />
					<Form.Text className="text-muted">
						Everyone loves a memorable name.
					</Form.Text>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Description</Form.Label>
					<Form.Control as="textarea" rows={4} placeholder="Description" />
					<Form.Text className="text-muted">
						A short summary of why your idea is worth the investment.
					</Form.Text>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Minimum Contribution</Form.Label>
					<Form.Control type="text" placeholder="Value in ether" />
					<Form.Text className="text-muted">
						The minimum amount to be considered an investor.
					</Form.Text>
				</Form.Group>
				<div className={styles.submit}>
					<Button variant="outline-secondary" className={`btn-lg ${styles.button}`}
					onClick={handleBackClicked}>
						Back
					</Button>
					<Button variant="primary" className={`btn-lg ${styles.button}`}>Create</Button>
				</div>
			</Form>
		</Card.Body>
	  </Card>
	</div>
  )
}
