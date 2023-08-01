import axios from "axios";
import { useState } from "react";

export default function TickerPrice({ token }) {
  let url = `${import.meta.env.VITE_PAPRIKA_URL}tickers/${token.id}`;
  const [price, setPrice] = useState(0);

  axios
    .get(url)
    .then((res) => {
      if (res.status === 200 && res != undefined) {
        setPrice(res.data.quotes.USD.price.toFixed(2));
      }
    })
    .catch((e) => {
      console.error(e);
    });

  return <>${price}</>;
}
