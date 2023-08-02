import { Col, Row } from "react-bootstrap";
import { useMetaMask } from "../hooks/useMetamask";
import { useEffect, useState } from "react";
import TradingPanel from "../components/TradingPanel/TradingPanel";
import { formatToBytes32 } from "../utils";
import PairPanel from "../components/PairPanel/PairPanel";
import OrdersPanel from "../components/OrdersPanel/OrdersPanel";
import UserOrderPanel from "../components/UserOrderPanel/UserOrderPanel";

const ORDERTYPE = {
  LIMIT: "LIMIT",
  MARKET: "MARKET",
};

export default function Dex() {
  const { dex } = useMetaMask();
  const [orderType, setOrderType] = useState(ORDERTYPE.LIMIT);
  const [selectedToken, setSelectedToken] = useState("LINK");
  const [orderAction, setOrderAction] = useState(0);
  const [orderBook, setOrderBook] = useState([]);

  useEffect(() => {
    async function getOrderBook(token) {
      return await dex?.methods
        .getOrderBook(token, orderAction)
        .call()
        .then((res) => {
          setOrderBook(res);
        });
    }

    getOrderBook(formatToBytes32(selectedToken), orderAction);
  }, [dex, orderAction, selectedToken]);

  return (
    <>
      <Row className="my-5">
        <Col
          lg={3}
          xs={12}
          className="pair-panel bg-opaque p-3 format-container"
        >
          <PairPanel setSelectedToken={setSelectedToken} />
        </Col>
        <Col lg={6} xs={12} className="trading-panel">
          <div className="bg-opaque border-brand-primary p-4">
            <TradingPanel
              orderType={orderType}
              setOrderType={setOrderType}
              ORDERTYPE={ORDERTYPE}
              selectedToken={selectedToken}
              orderAction={orderAction}
              setOrderAction={setOrderAction}
            />
          </div>
        </Col>
        <Col
          lg={3}
          xs={12}
          className="bg-opaque p-3 order-panel format-container"
        >
          <OrdersPanel orderBook={orderBook} selectedToken={selectedToken} />
        </Col>
      </Row>
      <Row className="my-5 justify-content-center">
        <Col lg={6} xs={12} className="user-order-panel">
          <div className="bg-opaque border-brand-primary p-4 format-container">
            <UserOrderPanel
              orderBook={orderBook}
              selectedToken={selectedToken}
              orderAction={orderAction}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}
