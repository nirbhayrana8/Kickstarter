import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import Link from "next/Link";

import { useAuth } from "../contexts/AuthContext"

export default function _Navbar() {

  const { currentUser, logout } = useAuth();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
        <Link href="/" passHref>
          <Navbar.Brand>Kickstarter</Navbar.Brand>
        </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <Link href="/" passHref>
              <Nav.Link>Home</Nav.Link>
            </Link>
            <Link href="/campaigns/new-campaign" passHref>
              <Nav.Link>Start a campaign</Nav.Link>
            </Link>
              {!currentUser && <Link href="/login" passHref><Nav.Link>Login</Nav.Link></Link> }
              {currentUser && <NavDropdown title="My Account">
                <NavDropdown.Item>Created campaigns</NavDropdown.Item>
                <NavDropdown.Item>Account settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
              </NavDropdown>}
            </Nav>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
