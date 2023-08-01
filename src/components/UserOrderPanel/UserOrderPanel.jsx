import { Col } from "react-bootstrap";
import Tbl from "../Table/Table";
import { formatBalance, formatToBytes32 } from "../../utils";
import { useMetaMask } from "../../hooks/useMetamask";

export default function UserOrderPanel({
  orderBook,
  orderAction,
  selectedToken,
}) {
  const { dex, wallet, loadWeb3 } = useMetaMask();

  const headings = {
    0: "Order Id",
    1: "Price",
    2: "Amount",
    3: "Action",
  };

  const rows = [];
  {
    orderBook.map((order) => {
      if (
        order.trader === window.web3.utils.toChecksumAddress(wallet.accounts[0])
      ) {
        rows.push({
          orderId: order.id.toString().slice(0, 8),
          price: formatBalance(window.web3.utils.toWei(order.amount, "ether")),
          amount: formatBalance(window.web3.utils.toWei(order.price, "ether")),
          action: (
            <a
              onClick={() =>
                deleteOrder(
                  order.id,
                  formatToBytes32(selectedToken),
                  orderAction
                )
              }
            >
              Delete order
            </a>
          ),
        });
      }
    });
  }

  function deleteOrder(id, ticker, orderType) {
    dex?.methods
      .deleteOrder(id, ticker, orderType)
      .send({
        from: wallet.accounts[0],
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        loadWeb3();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <>
      <Col>
        <h3>
          Your {selectedToken} {orderAction === 0 ? "Buy" : "Sell"} Orders
        </h3>
      </Col>
      <Col>
        <Tbl showHeadings headings={headings} rows={rows} />
      </Col>
    </>
  );
}
