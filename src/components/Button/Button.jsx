import { Button } from "react-bootstrap";

export default function Btn({ text, classes = false, type, action, disabled }) {
  return (
    <>
      <Button
        type={type ? type : "button"}
        className={classes ? classes + " custom-btn" : "custom-btn"}
        role="button"
        aria-label={text}
        onClick={action ? action : null}
        disabled={disabled}
      >
        <span>{text ? text : "button"}</span>
      </Button>
    </>
  );
}
