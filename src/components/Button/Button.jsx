import { Button } from "react-bootstrap";

export default function Btn({
  text,
  classes = false,
  variant,
  type,
  action, 
  disabled,
}) {
  return (
    <>
      <Button
        type={type ? type : "button"}
        className={classes ? classes + " custom-btn mx-2" : "custom-btn mx-2"}
        role="button"
        aria-label={text}
        onClick={action ? action : null}
        variant={variant ? variant : "primary"}
        disabled={disabled}
      >
        <span>{text ? text : "button"}</span>
      </Button>
    </>
  );
}
