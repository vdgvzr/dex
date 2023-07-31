import { Col } from "react-bootstrap";
import Form from "../forms/Form";

export default function Admin() {
  return (
    <>
      <Col xs={6} className="p-4 bg-opaque">
        <Form type="addToken" />
      </Col>
    </>
  );
}
