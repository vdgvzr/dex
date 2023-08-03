import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { PAGES } from "../../router";
import { useMetaMask } from "../../hooks/useMetamask";
import { formatAddress } from "../../utils";
import Btn from "../Button/Button";
import Icon from "../Icon/Icon";
import { Link } from "react-router-dom";
import Input from "../Input/Input";
import { NavDropdown } from "react-bootstrap";

function Navigation({ setTheme }) {
  const { wallet, hasProvider, isConnecting, connectMetaMask, owner } =
    useMetaMask();

  function isOwner(wallet, owner) {
    if (wallet.accounts[0] != undefined && owner != undefined) {
      return owner.toUpperCase() === wallet.accounts[0].toUpperCase();
    }
  }

  const themes = [
    {
      name: "Default",
      primary: "hsl(332, 87%, 70%)",
      secondary: "hsl(179, 86%, 47%)",
    },
    {
      name: "Synthwave",
      primary: "#ff19e8",
      secondary: "#ff901f",
    },
    {
      name: "Vaporwave",
      primary: "#ffd319",
      secondary: "#03fff0",
    },
    {
      name: "Pit Viper",
      primary: "#3be528",
      secondary: "#B026FF",
    },
  ];

  return (
    <Navbar variant="dark" expand="lg" className="">
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
            <NavDropdown title="Theme" id="basic-nav-dropdown" className="me-4">
              {themes.map((theme, i) => {
                return (
                  <NavDropdown.Item
                    className="border-brand-primary"
                    onClick={() => {
                      setTheme({
                        primary: theme.primary,
                        secondary: theme.secondary,
                      });
                    }}
                    key={i}
                  >
                    {theme.name}
                  </NavDropdown.Item>
                );
              })}
            </NavDropdown>
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
                  {wallet.chainId}
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
