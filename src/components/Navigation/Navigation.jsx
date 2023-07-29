import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { PAGES } from "../../router";
import { useMetaMask } from "../../hooks/useMetamask";
import { formatAddress, formatChainAsNum } from "../../utils";
import Btn from "../Button/Button";
import Icon from "../Icon/Icon";
import { Link } from "react-router-dom";

function Navigation() {
  const { wallet, hasProvider, isConnecting, connectMetaMask, owner } =
    useMetaMask();

  function isOwner(wallet, owner) {
    if (wallet.accounts[0] != undefined && owner != undefined) {
      return owner.toUpperCase() === wallet.accounts[0].toUpperCase();
    }
  }

  return (
    <Navbar bg="transparent" variant="dark" expand="lg" className="">
      <Container>
        <Link className="navbar-brand" to="/">
          {import.meta.env.VITE_SITE_NAME}
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {PAGES.map((page, index) => {
              if (page.name !== "Admin" || isOwner(wallet, owner)) {
                return (
                  <Link className="nav-link" key={index} to={page.url}>
                    {page.name}
                  </Link>
                );
              }
            })}
            {!hasProvider && (
              <Link
                className="nav-link"
                to="https://metamask.io"
                target="_blank"
                rel="noreferrer"
              >
                Install MetaMask
              </Link>
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
                <Link
                  className="nav-link navbar__wallet-info disabled"
                  disabled={true}
                >
                  {formatChainAsNum(wallet.chainId)}
                </Link>
                <Link
                  className="nav-link navbar__wallet-info disabled"
                  disabled={true}
                >
                  <Icon icon="eth" />
                  {wallet.balance}
                </Link>
                <Link
                  className="nav-link "
                  to={`https://etherscan.io/address/${wallet.accounts[0]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {formatAddress(wallet.accounts[0])}
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
