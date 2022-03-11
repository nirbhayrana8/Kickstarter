import { useRef, useState } from "react";
import Link from "next/Link"
import {useRouter} from "next/router"
import { useAuth } from "../contexts/AuthContext";

import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"

import styles from "../styles/auth.module.css"

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, login } = useAuth();
  const router = useRouter();

  console.log("Login: " + login);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      router.push("/campaigns/new-campaign");
    } catch (error) {
      setError("Failed to sign in");
    }
    setLoading(false);
  }

  function handleNeedAnAccount() {
    router.push("/signup");
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Card.Body>
          <h2 className="text-center mb-4 "> Log In </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="btn w-100 mt-2" type="submit">
              Log In
            </Button>
            <div className="text-center mt-4">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className={`text-center mt-2 ${styles.link}`} onClick={handleNeedAnAccount}>
        Need an account?
      </div>
    </div>
  );
}
