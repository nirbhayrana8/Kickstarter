import Card from "react-bootstrap/Card"
import styles from "../styles/list-item.module.css"
import { useRouter } from "next/router"

export default function ListItem({ data }) {

	const router = useRouter();
	const handleClick = () => {
		router.push(`campaigns/${data.campaignAddress}`)
	}

  return (
	<Card className={styles.card} onClick={handleClick}>
		<Card.Header>
			<h3>{data.name}</h3>
		</Card.Header>
		<Card.Body>
			<p><b>Minimum Contribution: </b> {data.meta.minimumValue}</p>
			<p><b>Description: </b>{data.meta.description}</p>
		</Card.Body>
	</Card>
  )
}
