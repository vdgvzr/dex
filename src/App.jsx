import { Outlet, ScrollRestoration } from "react-router-dom";
import { MetaMaskContextProvider } from "./hooks/useMetamask";
import Navigation from "./components/Navigation/Navigation";
import { Container, Row } from "react-bootstrap";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <MetaMaskContextProvider>
        <Navigation />
        <ScrollRestoration />
        <Container className="main-content">
          <Row className="main-row align-items-center justify-content-center">
            <Outlet />
          </Row>
        </Container>
        <Footer />
      </MetaMaskContextProvider>
    </>
  );
}

export default App;
