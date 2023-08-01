import Tbl from "../Table/Table";
import { formatFromBytes32 } from "../../utils";
import { useMetaMask } from "../../hooks/useMetamask";
import axios from "axios";
import { useState } from "react";
import { getApi } from "../../api/api";

export default function PairPanel({ setSelectedToken }) {
  const { tokens } = useMetaMask();

  const headings = {
    0: "Pair",
    1: "Price (USD)",
  };

  const rows = [];

  tokens?.map(async (token) => {
    if (formatFromBytes32(token.ticker) !== "ETH") {
      /* let url = `${import.meta.env.VITE_PAPRIKA_URL}tickers/${formatFromBytes32(
        token.ticker
      ).toLowerCase()}-${formatFromBytes32(token.name).toLowerCase()}/`;
      console.log(
        await axios
          .get(url)
          .then((res) => {
            if (res.status === 200 && res != undefined) {
              return res.data.quotes.USD.price.toFixed(2);
            }
          })
          .catch((e) => {
            console.error(e);
          })
      ); */

      rows.push({
        pair: (
          <a onClick={() => setSelectedToken(formatFromBytes32(token.ticker))}>
            <span className="font-weight-bold">{`${formatFromBytes32(
              token.ticker
            )}`}</span>
            /ETH
          </a>
        ),
        price: 0,
      });
    }
  });

  return <Tbl showHeadings headings={headings} rows={rows} />;
}
