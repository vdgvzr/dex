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
        <Col xs={3} className="format-container bg-opaque pair-panel">
          <PairPanel setSelectedToken={setSelectedToken} />
        </Col>
        <Col
          xs={6}
          className="format-container bg-opaque border-brand-primary p-3 trading-panel"
        >
          <TradingPanel
            orderType={orderType}
            setOrderType={setOrderType}
            ORDERTYPE={ORDERTYPE}
            selectedToken={selectedToken}
            orderAction={orderAction}
            setOrderAction={setOrderAction}
          />
        </Col>
        <Col xs={3} className="format-container bg-opaque p-3 order-panel">
          <OrdersPanel orderBook={orderBook} />
        </Col>
      </Row>
      <Row className="my-5 justify-content-center">
        <Col
          xs={6}
          className="bg-opaque border-brand-primary p-3 user-order-panel"
        >
          <UserOrderPanel
            orderBook={orderBook}
            selectedToken={selectedToken}
            orderAction={orderAction}
          />
        </Col>
      </Row>
    </>
  );
}
