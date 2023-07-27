import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { PAGES } from "../../router";
import { useMetaMask } from "../../hooks/useMetamask";
import { formatAddress } from "../../utils";

function Navigation() {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="">
      <Container>
        <Navbar.Brand href="/">{import.meta.env.VITE_SITE_NAME}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {PAGES.map((page, index) => {
              if (page.name !== "App") {
                return (
                  <Nav.Link key={index} href={page.url}>
                    {page.name}
                  </Nav.Link>
                );
              }
            })}
            {!hasProvider && (
              <a href="https://metamask.io" target="_blank" rel="noreferrer">
                Install MetaMask
              </a>
            )}
            {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
              <button
                className=""
                disabled={isConnecting}
                onClick={connectMetaMask}
              >
                Connect MetaMask
              </button>
            )}
            {hasProvider && wallet.accounts.length > 0 && (
              <a
                className=""
                href={`https://etherscan.io/address/${wallet.accounts[0]}`}
                target="_blank"
                rel="noreferrer"
              >
                {formatAddress(wallet.accounts[0])}
              </a>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
