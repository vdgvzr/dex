import { Col, Row } from "react-bootstrap";
import Form from "../forms/Form";
import { formatFromBytes32, isOwner } from "../utils";
import Static from "./Static";
import { useMetaMask } from "../hooks/useMetamask";
import Tbl from "../components/Table/Table";

export default function Admin() {
  const {
    wallet,
    owner,
    tokens,
    dex,
    setSuccessMessage,
    loadWeb3,
    setErrorMessage,
  } = useMetaMask();

  const headings = {
    0: "Index",
    1: "Token",
    2: "Action",
  };

  const rows = [];

  tokens?.map((token, i) => {
    rows.push({
      index: i,
      token: formatFromBytes32(token.ticker),
      action:
        formatFromBytes32(token.ticker) !== "ETH" ? (
          <a onClick={() => deleteToken(token.ticker, i)}>Delete token</a>
        ) : (
          "No action"
        ),
    });
  });

  function deleteToken(ticker, index) {
    dex?.methods
      .deleteToken(ticker, index)
      .send({
        from: wallet.accounts[0],
      })
      .once("receipt", () => {
        setSuccessMessage(`Successfully deleted ${formatFromBytes32(ticker)}!`);
        loadWeb3();
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  }

  return (
    <>
      {isOwner(wallet, owner) ? (
        <Row className="align-items-center justify-content-center main-content">
          <Col md={6} xs={12} className="p-4">
            <div className="p-4 bg-opaque border-brand-primary">
              <Form type="addToken" />
            </div>
          </Col>
          <Col md={6} xs={12} className="p-4">
            <div className="p-4 bg-opaque">
              <Tbl showHeadings headings={headings} rows={rows} />
            </div>
          </Col>
        </Row>
      ) : (
        <Static pageType="error" title="Access denied" />
      )}
    </>
  );
}
