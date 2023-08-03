import { Outlet, ScrollRestoration } from "react-router-dom";
import { MetaMaskContextProvider } from "./hooks/useMetamask";
import Navigation from "./components/Navigation/Navigation";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer/Footer";
import Logo from "./components/Logo";
import MessageBanner from "./components/MessageBanner/MessageBanner";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [theme, setTheme] = useLocalStorage("THEME", {
    primary: "hsl(332, 87%, 70%)",
    secondary: "hsl(179, 86%, 47%)",
  });

  document.documentElement.style.setProperty(
    "--primary-color",
    `${theme.primary}`
  );
  document.documentElement.style.setProperty(
    "--secondary-color",
    `${theme.secondary}`
  );

  return (
    <>
      <MetaMaskContextProvider>
        <div className="main-logo-container">
          <Logo />
        </div>
        <Navigation setTheme={setTheme} />
        <MessageBanner />
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
