import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"

import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/auth.module.css"

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      router.back();
    } catch (error) {
      console.log(error);
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  function handleLoginClicked() {
    router.replace("/login");
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Card.Body>
          <h2 className="text-center mb-4 "> Sign Up </h2>
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
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="btn w-100 mt-2" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className={`text-center mt-2 ${styles.link}`} onClick={handleLoginClicked}>
        Already have an account?
      </div>
    </div>
  );
}
