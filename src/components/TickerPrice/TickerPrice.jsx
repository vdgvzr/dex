import axios from "axios";
import { useEffect, useState } from "react";
import Icon from "../Icon/Icon";

export default function TickerPrice({ token }) {
  let url = `${import.meta.env.VITE_PAPRIKA_URL}tickers/${token.id}`;
  let ethUrl = `${import.meta.env.VITE_PAPRIKA_URL}tickers/eth-ethereum`;
  const [price, setPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    setPriceLoading(true);
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

    axios
      .get(ethUrl)
      .then((res) => {
        if (res.status === 200 && res != undefined) {
          setEthPrice(res.data.quotes.USD.price.toFixed(2));
        }
      })
      .catch((e) => {
        console.error(e);
      });
    setPriceLoading(false);
  }, [url, ethUrl, token]);

  return (
    <>
      <span className="ticker-price">
        {priceLoading ? (
          <Icon icon="spin" spin={true} />
        ) : (
          <>
            <Icon icon="eth" />
            {(price / ethPrice).toFixed(6)}
          </>
        )}
      </span>
    </>
  );
}
