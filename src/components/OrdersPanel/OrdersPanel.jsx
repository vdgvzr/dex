import { formatBalance } from "../../utils";
import Tbl from "../Table/Table";

export default function PairPanel({ orderBook }) {
  const headings = {
    0: "Price",
    1: "Amount",
  };

  const rows = [];

  {
    orderBook.map((order) => {
      rows.push({
        price: formatBalance(window.web3.utils.toWei(order.amount, "ether")),
        amount: formatBalance(window.web3.utils.toWei(order.price, "ether")),
      });
    });
  }

  return <Tbl showHeadings headings={headings} rows={rows} />;
}
