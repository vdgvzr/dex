import { useMetaMask } from "../../hooks/useMetamask";
import Tbl from "../../components/Table/Table";
import { formatToBytes32 } from "../../utils";
import WalletModal from "../../components/WalletModal/WalletModal";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";

export default function Wallet() {
  const { dex, link, wallet, loadWeb3, balances } = useMetaMask();

  const [input, setInput] = useState(0);
  const [showModal, setShowModal] = useState(true);

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
          <WalletModal
            showModal={showModal}
            buttonText="Deposit"
            token={balance.coin}
            setInput={setInput}
            value={
              balance.coin === "ETH"
                ? wallet.balance
                : window.web3.utils.fromWei(available, "ether")
            }
            action={() =>
              balance.coin === "ETH"
                ? depositEth(
                    wallet.accounts[0],
                    window.web3.utils.toWei(input, "ether")
                  )
                : deposit(
                    wallet.accounts[0],
                    window.web3.utils.toWei(input, "ether"),
                    balance.coin,
                    contract
                  )
            }
          />
          {parseFloat(balance.amount) >= 0 && (
            <WalletModal
              showModal={showModal}
              buttonText="Withdraw"
              token={balance.coin}
              setInput={setInput}
              value={balance.amount}
              action={() =>
                balance.coin === "ETH"
                  ? withdrawEth(
                      wallet.accounts[0],
                      window.web3.utils.toWei(input, "ether")
                    )
                  : withdraw(
                      wallet.accounts[0],
                      window.web3.utils.toWei(input, "ether"),
                      formatToBytes32(balance.coin)
                    )
              }
            />
          )}
        </>
      ),
    });
  });

  function depositEth(from, value) {
    dex?.methods
      .depositEth()
      .send({
        from,
        value,
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        loadWeb3();
        setInput("");
        setShowModal(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function withdrawEth(from, value) {
    dex?.methods
      .withdrawEth()
      .send({
        from,
        value,
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
        loadWeb3();
        setInput("");
        setShowModal(false);
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
          setInput("");
          setShowModal(false);
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
        setInput("");
        setShowModal(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col lg={8} md={10} xs={12} className="bg-opaque p-3">
          <Tbl
            showHeadings={true}
            headings={headings}
            rows={rows}
            classes="my-5"
          />
        </Col>
      </Row>
    </>
  );
}
