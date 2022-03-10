import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import styles from "../styles/dashboard.module.css";

import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
  return (
    <div style={{minHeight: "100vh",}}>
      <Container fluid className={styles.container}>
          <h1>
            Help fund creators to find out what is possible with human
            creativity
          </h1>
        <section>
          <Row md={4}>
            <Col className={styles.current_campaigns}>
              <h4>This is a test to see if this works</h4>
            </Col>
            <Col className={styles.current_campaigns}>
              <h4>This is a test to see if this works</h4>
            </Col>
            <Col className={styles.current_campaigns}>
              <h4>This is a test to see if this works</h4>
            </Col>
          </Row>
        </section>
        <section className={styles.create_campaign}>
          <h2>Looking for funding for your own ideas?</h2>
        </section>
        <Button variant="primary" className="btn-lg" onClick={() => router.push('/campaigns/new-campaign')}>
          Create a new campaign
        </Button>
      </Container>
    </div>
  );
}
