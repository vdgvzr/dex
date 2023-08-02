import { Col, Row } from "react-bootstrap";
import Btn from "../Button/Button";
import Icon from "../Icon/Icon";
import { useMetaMask } from "../../hooks/useMetamask";
import Input from "../Input/Input";
import { formatToBytes32 } from "../../utils";
import { useEffect, useRef, useState } from "react";

export default function TradingPanel({
  orderType,
  setOrderType,
  ORDERTYPE,
  selectedToken,
  orderAction,
  setOrderAction,
}) {
  const inputHeightref = useRef();

  const { wallet, dex, loadWeb3, balances } = useMetaMask();

  const [amountInput, setAmountInput] = useState(0);
  const [priceInput, setPriceInput] = useState(0);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    balances.map((balance) => {
      if (balance.coin === selectedToken) {
        setBalance(balance.amount);
      }
    });
  }, [selectedToken, balances]);

  function createLimitOrder(from, orderType, symbol, amount, price) {
    dex?.methods
      .createLimitOrder(orderType, symbol, parseInt(price * 100), amount)
      .send({
        from,
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        loadWeb3();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function createMarketOrder(from, orderType, symbol, amount) {
    dex?.methods
      .createMarketOrder(orderType, symbol, amount)
      .send({
        from,
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        loadWeb3();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <>
      <Row>
        <Col className="text-center mb-4">
          <h3>Trade {selectedToken}/ETH</h3>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6}>
          <Btn
            text={ORDERTYPE.LIMIT}
            classes={`me-2 w-100 ${
              orderType === "LIMIT" && "custom-btn__active"
            }`}
            action={() => setOrderType(ORDERTYPE.LIMIT)}
          />
        </Col>
        <Col xs={6}>
          <Btn
            text={ORDERTYPE.MARKET}
            classes={`ms-2 w-100 ${
              orderType === "MARKET" && "custom-btn__active"
            }`}
            action={() => setOrderType(ORDERTYPE.MARKET)}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6}>
          <Btn
            text="Buy"
            classes={`me-2 w-100 ${orderAction === 0 && "custom-btn__active"}`}
            action={() => setOrderAction(0)}
          />
        </Col>
        <Col xs={6}>
          <Btn
            text="Sell"
            classes={`ms-2 w-100 ${orderAction === 1 && "custom-btn__active"}`}
            action={() => setOrderAction(1)}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col
          xs={3}
          className="d-flex align-items-center justify-content-center"
        >
          <div>{selectedToken}</div>
        </Col>
        <Col
          xs={3}
          className="d-flex align-items-center justify-content-center border-brand-primary p-2"
        >
          {balance}
        </Col>
        <Col
          xs={3}
          className="d-flex align-items-center justify-content-center"
        >
          <div>ETH</div>
        </Col>
        <Col
          xs={3}
          className="d-flex align-items-center justify-content-center border-brand-primary p-2"
        >
          <div>
            <Icon icon="eth" />
            {wallet.balance}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          {orderType === "LIMIT" ? (
            <Input
              type="number"
              placeholder="Price"
              label="Price"
              controlId="priceValue"
              setInput={setPriceInput}
              transfer={false}
              disabled={false}
            />
          ) : (
            <div
              className="mb-3"
              style={{ height: inputHeightref.current.offsetHeight }}
            ></div>
          )}
          <div ref={inputHeightref}>
            <Input
              type="number"
              placeholder="Amount"
              label="Amount"
              controlId="amountValue"
              setInput={setAmountInput}
              transfer={false}
              disabled={false}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Btn
            classes="w-100"
            text={`Submit ${orderType} ${
              orderAction === 0 ? "Buy" : "Sell"
            } order`}
            action={
              orderType === "LIMIT"
                ? () =>
                    createLimitOrder(
                      wallet.accounts[0],
                      orderAction,
                      formatToBytes32(selectedToken),
                      amountInput,
                      priceInput
                    )
                : () =>
                    createMarketOrder(
                      wallet.accounts[0],
                      orderAction,
                      formatToBytes32(selectedToken),
                      amountInput
                    )
            }
          />
        </Col>
      </Row>
    </>
  );
}
