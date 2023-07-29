import { Form } from "react-bootstrap";
import { useMetaMask } from "../../hooks/useMetamask";

export default function Input({
  type,
  placeholder,
  step = null,
  innerRef,
  label,
  text,
  controlId,
  transfer,
  defaultValue,
  options,
  disabled = false,
}) {
  const { wallet } = useMetaMask();
  /* const formatConnectedBalance = window.web3.utils.fromWei(
    connectedBalance.toString(),
    "ether"
  ); */

  /* const valueElement = (
    <>
      <div className="form-input__balance-element d-flex justify-content-between">
        <div>{text}</div>
        <div
          className="form-input__balance-element-balance"
          onClick={() => {
            type === "number"
              ? (innerRef.current.value = transfer
                  ? wallet.balance
                  : formatConnectedBalance)
              : null;
            type === "text"
              ? transfer
                ? (innerRef.current.value = wallet.accounts[0])
                : null
              : null;
            setInput(true);
          }}
        >
          {type === "number" ? (
            transfer ? (
              <span>Max: {wallet.balance} ETH</span>
            ) : (
              <span>Max: {formatConnectedBalance} ETH</span>
            )
          ) : null}
          {type === "text"
            ? transfer
              ? utils.formatAddress(wallet.accounts[0])
              : null
            : null}
        </div>
      </div>
    </>
  ); */

  return (
    <>
      <Form.Group className="mb-3" controlId={controlId}>
        <Form.Label>{type && label}</Form.Label>
        {type === "select" ? (
          <Form.Select defaultValue={defaultValue}>{options}</Form.Select>
        ) : (
          <Form.Control
            type={type && type}
            placeholder={placeholder}
            step={
              type && type === "number" ? (step != null ? step : null) : null
            }
            ref={innerRef && innerRef}
            disabled={disabled}
          />
        )}

        {/* <Form.Text>{valueElement}</Form.Text> */}
      </Form.Group>
    </>
  );
}
