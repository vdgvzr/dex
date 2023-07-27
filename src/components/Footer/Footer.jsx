import { Container } from "react-bootstrap";
import { useMetaMask } from "../../hooks/useMetamask";

function Footer() {
  let { error, errorMessage, clearError } = useMetaMask();

  return (
    <footer className="footer text-center p-3 sticky bg-dark text-light">
      <Container>
        <div className="" style={error ? { backgroundColor: "red" } : {}}>
          {error && (
            <div onClick={clearError}>
              <strong>Error:</strong> {errorMessage}
            </div>
          )}
        </div>
        &copy; {new Date().getFullYear()} Copyright:{" "}
        <a
          className="ms-2"
          href={import.meta.env.VITE_DEVELOPER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {import.meta.env.VITE_DEVELOPER}
        </a>
      </Container>
    </footer>
  );
}

export default Footer;
