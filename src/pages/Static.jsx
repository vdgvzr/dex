import { Link, useRouteError } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Btn from "../components/Button/Button";
import { useMetaMask } from "../hooks/useMetamask";
import Icon from "../components/Icon/Icon";

export default function StaticPage({ pageType, title, copy, buttonText }) {
  const { isConnecting, connectMetaMask, wallet, hasProvider, isLoading } =
    useMetaMask();
  const error = useRouteError();
  const preStyle = { whiteSpace: "pre-wrap" };

  return (
    <>
      <Row className="main-content align-items-center">
        <Col md={6} className="bg-opaque p-3">
          {isLoading ? (
            <Icon icon="spin" spin={true} />
          ) : (
            <>
              <h1 className="mb-4" style={{ color: "var(--primary-color)" }}>
                {title}
              </h1>
              {pageType === "error" &&
                import.meta.env.MODE !== "production" && (
                  <>
                    <pre className="my-4" style={preStyle}>
                      {error?.message}
                    </pre>
                    <pre className="my-4" style={preStyle}>
                      {error?.stack}
                    </pre>
                  </>
                )}
              {copy && (
                <pre className="my-4" style={preStyle}>
                  {copy}
                </pre>
              )}
              <Link
                to={
                  pageType === "home"
                    ? window.ethereum?.isMetaMask && wallet.accounts.length < 1
                      ? "/"
                      : hasProvider
                      ? "/trade"
                      : "https://metamask.io"
                    : "/"
                }
              >
                <Btn
                  disabled={isConnecting}
                  text={
                    !hasProvider ||
                    (window.ethereum?.isMetaMask && wallet.accounts.length < 1)
                      ? hasProvider
                        ? "Connect Wallet"
                        : "Install metamask"
                      : buttonText
                  }
                  action={
                    window.ethereum?.isMetaMask && wallet.accounts.length < 1
                      ? connectMetaMask
                      : null
                  }
                />
              </Link>
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
