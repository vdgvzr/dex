import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { PAGES } from "../../router";
import { useMetaMask } from "../../hooks/useMetamask";
import { formatAddress, formatChainAsNum } from "../../utils";
import Btn from "../Button/Button";
import Icon from "../Icon/Icon";

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
              <Nav.Link
                href="https://metamask.io"
                target="_blank"
                rel="noreferrer"
              >
                Install MetaMask
              </Nav.Link>
            )}
            {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
              <Btn
                disabled={isConnecting}
                text="Connect Wallet"
                action={connectMetaMask}
              />
            )}
            {hasProvider && wallet.accounts.length > 0 && (
              <>
                <Nav.Link className="navbar__wallet-info" disabled={true}>
                  {formatChainAsNum(wallet.chainId)}
                </Nav.Link>
                <Nav.Link className="navbar__wallet-info" disabled={true}>
                  <Icon icon="eth" />
                  {wallet.balance}
                </Nav.Link>
                <Nav.Link
                  className=""
                  href={`https://etherscan.io/address/${wallet.accounts[0]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {formatAddress(wallet.accounts[0])}
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
