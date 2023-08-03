import { useRouteError } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

export default function Error() {
  const error = useRouteError();

  const preStyle = { whiteSpace: "pre-wrap" };

  return (
    <>
      <Row className="main-content align-items-center">
        <Col className="bg-opaque">
          <h1 style={{ color: "var(--primary-color)" }}>
            Error - Something went wrong
          </h1>
          <>
            <pre style={preStyle}>{error.message}</pre>
            <pre style={preStyle}>{error.stack}</pre>
          </>
        </Col>
      </Row>
    </>
  );
}
