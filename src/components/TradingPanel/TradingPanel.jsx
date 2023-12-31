import { Col, Row } from "react-bootstrap";
import Btn from "../Button/Button";
import Icon from "../Icon/Icon";
import { useMetaMask } from "../../hooks/useMetamask";
import Input from "../Input/Input";
import { formatToBytes32, formatFromBytes32 } from "../../utils";
import { useEffect, useRef, useState } from "react";

export default function TradingPanel({
  orderType,
  setOrderType,
  ORDERTYPE,
  selectedToken,
  orderAction,
  setOrderAction,
  isLoading,
}) {
  const inputHeightref = useRef();

  const {
    wallet,
    dex,
    loadWeb3,
    balances,
    setErrorMessage,
    setSuccessMessage,
  } = useMetaMask();

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
      .createLimitOrder(
        orderType,
        symbol,
        parseInt(amount),
        window.web3.utils.toWei(price, "ether")
      )
      .send({
        from,
      })
      .once("receipt", () => {
        setSuccessMessage(
          `Created ${
            orderType === 0 ? "buy" : "sell"
          } limit order for: ${amount} ${formatFromBytes32(
            symbol
          )} at $${price}`
        );
        loadWeb3();
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  }

  function createMarketOrder(from, orderType, symbol, amount) {
    dex?.methods
      .createMarketOrder(orderType, symbol, parseInt(amount))
      .send({
        from,
      })
      .once("receipt", () => {
        setSuccessMessage(
          `Created ${
            orderType === 0 ? "buy" : "sell"
          } limit order for: ${amount} ${formatFromBytes32(symbol)}`
        );
        loadWeb3();
        loadWeb3();
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  }

  return (
    <>
      {isLoading ? (
        <Row className="justify-content-center align-items-center main-content">
          <Col lg={8} md={10} xs={12} className="format-container">
            <Icon icon="spin" spin={true} />
          </Col>
        </Row>
      ) : (
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
                classes={`w-100 ${
                  orderType === "LIMIT" && "custom-btn__active"
                }`}
                action={() => setOrderType(ORDERTYPE.LIMIT)}
              />
            </Col>
            <Col xs={6}>
              <Btn
                text={ORDERTYPE.MARKET}
                classes={`w-100 ${
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
                classes={`w-100 ${orderAction === 0 && "custom-btn__active"}`}
                action={() => setOrderAction(0)}
              />
            </Col>
            <Col xs={6}>
              <Btn
                text="Sell"
                classes={`w-100 ${orderAction === 1 && "custom-btn__active"}`}
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
              className="d-flex align-items-center justify-content-center py-2"
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
              className="d-flex align-items-center justify-content-center py-2"
            >
              <div>
                <Icon icon="eth" />
                {balances[0]?.amount}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {orderType === "LIMIT" &&
              (balances[0]?.amount > 0 || orderAction === 1) ? (
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
                  style={{
                    height:
                      inputHeightref.current != undefined &&
                      inputHeightref.current.offsetHeight,
                  }}
                ></div>
              )}
              {balances[0]?.amount > 0 || orderAction === 1 ? (
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
              ) : (
                <div
                  className="mb-3"
                  style={{
                    height:
                      inputHeightref.current != undefined &&
                      inputHeightref.current.offsetHeight,
                  }}
                ></div>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Btn
                disabled={!(balances[0]?.amount > 0 || orderAction === 1)}
                classes="w-100"
                text={
                  balances[0]?.amount > 0 || orderAction === 1
                    ? `Submit ${orderType} ${
                        orderAction === 0 ? "Buy" : "Sell"
                      } order`
                    : "Deposit ETH to continue"
                }
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
      )}
    </>
  );
}
