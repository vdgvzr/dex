import { Col } from "react-bootstrap";
import { formatBalance } from "../../utils";
import Tbl from "../Table/Table";
import Icon from "../Icon/Icon";

export default function PairPanel({ orderBook, selectedToken, orderAction }) {
  const headings = {
    0: "Price",
    1: `Total (${selectedToken})`,
    2: "%",
  };

  const rows = [];

  let duplicates = [];

  for (let i = 0; i < orderBook.length - 1; i++) {
    let total = 0;
    if (orderBook[i].price === orderBook[i + 1].price) {
      total += parseInt(orderBook[i].amount) + parseInt(orderBook[i].amount);
      duplicates.push({ price: parseInt(orderBook[i].price), amount: total });
    } else {
      duplicates.push({
        price: parseInt(orderBook[i].price),
        amount: parseInt(orderBook[i].amount),
      });
    }
  }

  duplicates.push({
    price: parseInt(orderBook[orderBook.length - 1]?.price),
    amount: parseInt(orderBook[orderBook.length - 1]?.amount),
  });

  let orders = duplicates.filter(
    (value, index, self) =>
      index === self.findIndex((order) => order.price === value.price)
  );

  const percentage = orders.reduce(function (acc, value) {
    return acc + value.amount;
  }, 0);
  {
    orders.map((order) => {
      if (order.price > 0 && order.amount > 0) {
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
          percentage: ((order.amount / percentage) * 100).toFixed(2),
        });
      }
    });
  }

  return (
    <>
      <Col className="text-center orders-panel">
        <h3>{orderAction === 0 ? "Buy" : "Sell"} Orderbook</h3>
      </Col>
      <Col>
        <Tbl showHeadings headings={headings} rows={rows} />
      </Col>
    </>
  );
}
