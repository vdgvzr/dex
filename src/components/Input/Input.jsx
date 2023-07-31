import { Form } from "react-bootstrap";
import { useMetaMask } from "../../hooks/useMetamask";
import { formatAddress } from "../../utils";
import { useRef } from "react";

export default function Input({
  type,
  placeholder,
  step = null,
  label,
  setInput,
  text,
  controlId,
  defaultValue,
  options,
  disabled = false,
  value,
}) {
  const inputRef = useRef();

  const valueElement = (
    <>
      <div className="form-input__balance-element d-flex justify-content-between">
        <div>{text}</div>
        <div
          className="form-input__balance-element-balance"
          onClick={() => (inputRef.current.value = value)}
        >
          <span>Max: {value} </span>
        </div>
      </div>
    </>
  );

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
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            disabled={disabled}
          />
        )}

        <Form.Text>{valueElement}</Form.Text>
      </Form.Group>
    </>
  );
}
