import { useRef, useEffect } from "react";
import styles from "../styles/progress-button.module.css"

export default function ProgressButton() {
	const btnRef = useRef();

	useEffect(() => {
		btnRef.current.addEventListener("click", () => {
			btnRef.current.classList.add(styles.animating);
		  });
	}, []);

  return (
	  <>
	  <button ref={btnRef} className={styles.btn}>Submit</button>
	  <div className={styles.checkmark_container}>
		<svg
		  className={styles.checkmark_svg}
		  x="0px"
		  y="0px"
		  viewBox="0 0 25 30"
		  width="50px"
		  fill="none"
		>
		  <path d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2" />
		</svg>
	  </div>
	  </>
  )
}
