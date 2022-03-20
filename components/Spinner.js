import styles from "../styles/spinner.module.css"

export default function Spinner() {
  return (
	<div className={styles.load_spinner}>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</div>
  )
}
