import { useState } from "react";
import Btn from "../components/Button/Button";
import { useMetaMask } from "../hooks/useMetamask";
import { formatToBytes32 } from "../utils/index";

export default function Wallet() {
  const { dex, wallet } = useMetaMask();

  const [ethBalance, setEthBalance] = useState("0");

  async function getEthBalance() {
    const owner = await dex?.methods
      .balances(wallet.accounts[0], formatToBytes32("ETH"))
      .call();

    setEthBalance(window.web3.utils.fromWei(owner.toString(), "ether"));
  }

  getEthBalance();

  function depositEth(from) {
    dex?.methods
      .depositEth()
      .send({
        from,
        value: window.web3.utils.toWei(1, "ether"),
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <div>
      <Btn text="deposit eth" action={() => depositEth(wallet.accounts[0])} />
      <div>{ethBalance}</div>
    </div>
  );
}
