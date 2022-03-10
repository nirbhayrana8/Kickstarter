import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/Link";
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"

import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/auth.module.css"

export default function ForgotPassword() {
  const emailRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your email for further instructions");
    } catch (error) {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  const router = useRouter();
  function handleSignUpClicked() {
    router.push("/signup");
  }

  return (
    <div className={styles.container_alt}>
      <Card className={styles.card}>
        <Card.Body>
          <h2 className="text-center mb-4 "> Reset Password </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="btn w-100 mt-2" type="submit">
              Reset Password
            </Button>
            <div className="w-100 text-center mt-3">
              <Link href="/login">Login</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className={`text-center mt-2 ${styles.link}`} onClick={handleSignUpClicked}>
        Need an account?
      </div>
    </div>
  );
}
