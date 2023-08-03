import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="footer text-center p-3 sticky bg-dark text-light">
      <Container>
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
