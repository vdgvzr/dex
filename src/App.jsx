import { Outlet, ScrollRestoration } from "react-router-dom";
import { MetaMaskContextProvider } from "./hooks/useMetamask";
import Navigation from "./components/Navigation/Navigation";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <MetaMaskContextProvider>
        <Navigation />
        <ScrollRestoration />
        <Container className="main-content">
          <Outlet />
        </Container>
        <Footer />
      </MetaMaskContextProvider>
    </>
  );
}

export default App;
