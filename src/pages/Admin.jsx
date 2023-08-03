import { Col, Row } from "react-bootstrap";
import Form from "../forms/Form";
import { isOwner } from "../utils";
import Static from "./Static";
import { useMetaMask } from "../hooks/useMetamask";

export default function Admin() {
  const { wallet, owner } = useMetaMask();

  return (
    <>
      {isOwner(wallet, owner) ? (
        <Row className="align-items-center justify-content-center main-content">
          <Col md={6} xs={12} className="p-4">
            <div className="p-4 bg-opaque border-brand-primary">
              <Form type="addToken" />
            </div>
          </Col>
        </Row>
      ) : (
        <Static pageType="error" title="Access denied" />
      )}
    </>
  );
}
