import { Col, Row } from "react-bootstrap";
import { useMetaMask } from "../hooks/useMetamask";

export default function Dex() {
  const { isLoading, dex, tokens } = useMetaMask();

  return (
    <>
      <Row>
        <Col>
          <Row>
            <div>{!isLoading && dex?._address}</div>
            <div>
              <ul>
                {tokens !== "0x0" &&
                  tokens.map((token, i) => {
                    return <li key={i}>{token.ticker}</li>;
                  })}
              </ul>
            </div>
          </Row>
        </Col>
      </Row>
    </>
  );
}
