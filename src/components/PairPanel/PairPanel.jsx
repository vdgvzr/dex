import Tbl from "../Table/Table";
import { formatFromBytes32 } from "../../utils";
import { useMetaMask } from "../../hooks/useMetamask";
import { Col } from "react-bootstrap";
import TickerPrice from "../TickerPrice/TickerPrice";

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
        price: <TickerPrice token={token} />,
      });
    }
  });

  return (
    <>
      <Col className="text-center">
        <h3>Token Pairs</h3>
      </Col>
      <Col>
        <Tbl showHeadings headings={headings} rows={rows} />
      </Col>
    </>
  );
}
