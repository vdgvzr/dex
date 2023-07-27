import { Outlet, ScrollRestoration } from "react-router-dom";
import { MetaMaskContextProvider } from "./hooks/useMetamask";
import Navigation from "./components/Navigation/Navigation";
import { Container } from "react-bootstrap";
import Footer from "./assets/Footer/Footer";

function App() {
  return (
    <>
      <MetaMaskContextProvider>
        <Navigation />
        <ScrollRestoration />
        <Container>
          <Outlet />
        </Container>
        <Footer />
      </MetaMaskContextProvider>
    </>
  );
}

export default App;
