import { Container } from "react-bootstrap";
import { useMetaMask } from "../../hooks/useMetamask";

export default function MessageBanner() {
  const {
    error,
    errorMessage,
    clearError,
    success,
    successMessage,
    clearSuccess,
  } = useMetaMask();

  return (
    <>
      {error && (
        <div
          className="message-banner text-center bg-danger"
          onClick={clearError}
        >
          <Container>{errorMessage}</Container>
        </div>
      )}
      {success && (
        <div
          className="message-banner text-center bg-success"
          onClick={clearSuccess}
        >
          <Container>{successMessage}</Container>
        </div>
      )}
    </>
  );
}
