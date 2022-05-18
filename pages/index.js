import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import styles from "../styles/dashboard.module.css";

import ListItem from "../components/ListItem"
import { getAllCampaigns } from "../config/database";

import { useRouter } from 'next/router'

export const getServerSideProps = async () => {
  let data = await getAllCampaigns();
  if (data) {
    const keys = Object.keys(data);
    data = Object.values(data);
    data = data.slice(0, 3);
    data.forEach((campaign, index) => {
      campaign.campaignAddress = keys[index];
    });
  }
  return { props: { data } }
}

export default function Home({ data }) {
  const router = useRouter();
  console.log(data)
  return (
    <div style={{minHeight: "100vh",}}>
      <Container fluid className={styles.container}>
          <h1>
            Help fund creators to find out what is possible with human
            creativity
          </h1>
        <section>
          <Row md={4}>
            {data.map(campaignData => (
              <Col>
                <ListItem key={data.campaignAddress} data={campaignData}/>
              </Col>
            ))}
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
