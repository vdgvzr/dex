import Btn from "../components/Button/Button";
import { useMetaMask } from "../hooks/useMetamask";
import Tbl from "../components/Table/Table";
import { formatToBytes32 } from "../utils";

export default function Wallet() {
  const { dex, link, wallet, loadWeb3, balances } = useMetaMask();

  const headings = {
    0: "Coin",
    1: `${import.meta.env.VITE_SITE_NAME} Balance`,
    2: "Metamask Balance",
    3: "Action",
  };

  const rows = [];

  balances.map((balance) => {
    let contract;
    let available;

    if (balance.coin === "LINK") {
      contract = link.contract;
      available = link.available;
    }

    rows.push({
      coin: balance.coin,
      amount: balance.amount,
      available:
        balance.coin === "ETH"
          ? wallet.balance
          : window.web3.utils.fromWei(available, "ether"),
      action: (
        <>
          <Btn
            text="deposit"
            action={() =>
              balance.coin === "ETH"
                ? depositEth(wallet.accounts[0])
                : deposit(
                    wallet.accounts[0],
                    window.web3.utils.toWei(500, "ether"),
                    balance.coin,
                    contract
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
                      window.web3.utils.toWei(400, "ether"),
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

  function deposit(from, amount, ticker, contract) {
    contract?.methods
      .approve(dex?._address, amount)
      .send({ from })
      .once("receipt", (receipt) => {
        console.log(receipt);
        _deposit();
      })
      .catch((e) => {
        console.error(e);
      });

    function _deposit() {
      dex?.methods
        .deposit(amount, formatToBytes32(ticker))
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
