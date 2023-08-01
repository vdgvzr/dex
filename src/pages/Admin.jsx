import { Col, Row } from "react-bootstrap";
import Form from "../forms/Form";

export default function Admin() {
  return (
    <>
      <Row className="align-items-center justify-content-center main-content">
        <Col xs={6} className="p-4 bg-opaque border-brand-primary">
          <Form type="addToken" />
        </Col>
      </Row>
    </>
  );
}
