import { Col } from "react-bootstrap";
import { formatBalance } from "../../utils";
import Tbl from "../Table/Table";

export default function PairPanel({ orderBook, selectedToken }) {
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

  let orders = duplicates.filter(
    (value, index, self) =>
      index === self.findIndex((order) => order.price === value.price)
  );

  const percentage = orders.reduce(function (acc, value) {
    return acc + value.amount;
  }, 0);
  {
    orders.map((order) => {
      rows.push({
        price:
          "$" + formatBalance(window.web3.utils.toWei(order.price, "ether")),
        amount:
          formatBalance(window.web3.utils.toWei(order.amount, "ether")) +
          " " +
          selectedToken,
        percentage: ((order.amount / percentage) * 100).toFixed(2),
      });
    });
  }

  return (
    <>
      <Col className="text-center">
        <h3>Orderbook</h3>
      </Col>
      <Col>
        <Tbl showHeadings headings={headings} rows={rows} />
      </Col>
    </>
  );
}
