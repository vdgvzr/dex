import { Col } from "react-bootstrap";
import Tbl from "../Table/Table";
import { formatBalance, formatToBytes32 } from "../../utils";
import { useMetaMask } from "../../hooks/useMetamask";
import Icon from "../Icon/Icon";

export default function UserOrderPanel({
  orderBook,
  orderAction,
  selectedToken,
}) {
  const { dex, wallet, loadWeb3, setSuccessMessage, setErrorMessage } =
    useMetaMask();

  const headings = {
    0: "Price",
    1: "Amount",
    2: "Action",
  };

  const rows = [];
  {
    orderBook.map((order) => {
      if (wallet.accounts[0] != undefined) {
        if (
          order.trader ===
          window.web3.utils.toChecksumAddress(wallet?.accounts[0])
        ) {
          rows.push({
            price: (
              <>
                <Icon icon="eth" />
                {window.web3.utils.fromWei(order.price, "ether")}
              </>
            ),
            amount:
              formatBalance(window.web3.utils.toWei(order.amount, "ether")) +
              " " +
              selectedToken,
            action: (
              <a
                onClick={() => {
                  deleteOrder(
                    parseInt(order.id),
                    formatToBytes32(selectedToken),
                    orderAction
                  );
                }}
              >
                Delete order
              </a>
            ),
          });
        }
      }
    });
  }

  function deleteOrder(id, ticker, orderType) {
    dex?.methods
      .deleteOrder(id, ticker, orderType)
      .send({
        from: wallet.accounts[0],
      })
      .once("receipt", () => {
        setSuccessMessage("Successfully deleted order!");
        loadWeb3();
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  }

  return (
    <>
      <Col>
        <h3 className="text-center">
          Your {selectedToken} {orderAction === 0 ? "Buy" : "Sell"} Orders
        </h3>
      </Col>
      <Col>
        <Tbl showHeadings headings={headings} rows={rows} />
      </Col>
    </>
  );
}
