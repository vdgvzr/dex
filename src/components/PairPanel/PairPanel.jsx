import Tbl from "../Table/Table";
import { formatFromBytes32 } from "../../utils";
import { useMetaMask } from "../../hooks/useMetamask";

export default function PairPanel({ setSelectedToken }) {
  const { tokens } = useMetaMask();

  const headings = {
    0: "Pair",
    1: "Price",
  };

  const rows = [];

  tokens?.map((token) => {
    if (formatFromBytes32(token.ticker) !== "ETH") {
      rows.push({
        pair: (
          <a onClick={() => setSelectedToken(formatFromBytes32(token.ticker))}>
            <span className="font-weight-bold">{`${formatFromBytes32(
              token.ticker
            )}`}</span>
            /ETH
          </a>
        ),
        price: "",
      });
    }
  });

  return <Tbl showHeadings headings={headings} rows={rows} />;
}
