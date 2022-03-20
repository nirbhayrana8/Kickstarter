import Spinner from './Spinner'
import styles from "../styles/load-screen.module.css"
import { useRef, useEffect } from "react"

export default function LoadingScreen(props) {
	const loadingScreenRef = useRef();

	useEffect(() => {

		if (props.loading) {
			loadingScreenRef.current.classList.add(styles.visible);
		} else {
			loadingScreenRef.current.classList.remove(styles.visible);
		}
	}, [props.loading])

  return (
	<div ref={loadingScreenRef} className={styles.container}>
		<h3>{props.text}</h3>
		<Spinner />
	</div>
  )
}
