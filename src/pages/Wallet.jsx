import { useEffect, useState } from "react";
import Btn from "../components/Button/Button";
import { useMetaMask } from "../hooks/useMetamask";
import Tbl from "../components/Table/Table";
import { formatBalance, formatFromBytes32, formatToBytes32 } from "../utils";

export default function Wallet() {
  const { dex, wallet, loadWeb3, tokens, balances } = useMetaMask();

  const headings = {
    0: "Coin",
    1: "Amount",
    2: "Action",
  };

  /* const rows = [
    {
      coin: "ETH",
      amount: ethBalance,
      action: (
        <>
          <Btn text="deposit" action={() => depositEth(wallet.accounts[0])} />
          <Btn text="withdraw" action={() => withdrawEth(wallet.accounts[0])} />
        </>
      ),
    },
  ]; */

  const rows = [];

  balances.map((balance) => {
    rows.push({
      coin: balance.coin,
      amount: balance.amount,
      action: (
        <>
          <Btn
            text="deposit"
            action={() =>
              balance.coin === "ETH"
                ? depositEth(wallet.accounts[0])
                : deposit(
                    wallet.accounts[0],
                    1000,
                    formatToBytes32(balance.coin)
                  )
            }
          />
          {parseFloat(balance.amount) >= 0 && (
            <Btn
              text="withdraw"
              action={() =>
                balance.coin === "ETH"
                  ? withdrawEth(wallet.accounts[0])
                  : withdraw(
                      wallet.accounts[0],
                      1000,
                      formatToBytes32(balance.coin)
                    )
              }
            />
          )}
        </>
      ),
    });
  });

  function depositEth(from) {
    dex?.methods
      .depositEth()
      .send({
        from,
        value: window.web3.utils.toWei(1, "ether"),
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        loadWeb3();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function withdrawEth(from) {
    dex?.methods
      .withdrawEth(window.web3.utils.toWei(1, "ether"))
      .send({
        from,
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        loadWeb3();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function deposit(from, amount, ticker) {
    dex?.methods
      .deposit(amount, ticker)
      .send({
        from,
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        loadWeb3();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function withdraw(from, amount, ticker) {
    dex?.methods
      .withdraw(amount, ticker)
      .send({
        from,
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
    <div>
      <Tbl showHeadings={true} headings={headings} rows={rows} />
    </div>
  );
}
