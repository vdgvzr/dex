import { Form } from "react-bootstrap";

export default function Input({
  type,
  placeholder,
  step = null,
  label,
  setInput = null,
  controlId,
  innerRef,
  defaultValue,
  options,
  disabled = false,
}) {
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
            onChange={
              setInput !== null ? (e) => setInput(e.target.value) : null
            }
            ref={innerRef}
            disabled={disabled}
          />
        )}
      </Form.Group>
    </>
  );
}
