import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Btn from "../Button/Button";
import Input from "../Input/Input";
import Icon from "../Icon/Icon";

function WalletModal({
  buttonText,
  action,
  token,
  setInput,
  value,
  showModal,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <a className="mx-2 text-uppercase" onClick={handleShow}>
        {buttonText}
      </a>

      <Modal
        className="wallet-modal"
        centered
        keyboard
        animation
        show={show ? showModal : show}
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title>
            {buttonText} {token}
          </Modal.Title>
          <span
            className="wallet-modal__close-button ms-auto"
            onClick={handleClose}
          >
            <Icon icon="close" />
          </span>
        </Modal.Header>
        <Modal.Body>
          <Input
            type="number"
            setInput={setInput}
            label={`Amount to ${buttonText}`}
            value={value}
          />
        </Modal.Body>
        <Modal.Footer>
          <Btn text={buttonText} action={action} />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default WalletModal;
