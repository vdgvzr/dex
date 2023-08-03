import { useRef } from "react";
import Btn from "../components/Button/Button";
import { Form } from "react-bootstrap";
import Input from "../components/Input/Input";
import { useMetaMask } from "../hooks/useMetamask";
import { formatToBytes32 } from "../utils";

export default function AddTokenForm() {
  const { wallet, dex, loadWeb3, setErrorMessage, setSuccessMessage } =
    useMetaMask();

  const tokenNameRef = useRef();
  const tokenIdRef = useRef();
  const tokenSymbolRef = useRef();
  const tokenAddressRef = useRef();

  function addToken(id, name, symbol, address) {
    dex?.methods
      .addToken(id, formatToBytes32(name), formatToBytes32(symbol), address)
      .send({
        from: wallet.accounts[0],
      })
      .once("receipt", () => {
        setSuccessMessage(`Successfully added ${symbol}!`);
        loadWeb3();
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  }

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const id = tokenIdRef.current.value;
          const name = tokenNameRef.current.value;
          const symbol = tokenSymbolRef.current.value;
          const address = tokenAddressRef.current.value;

          addToken(id, name, symbol, address);
        }}
      >
        <Input
          type="text"
          placeholder="Id"
          label="Token ID"
          text="Enter token ID"
          controlId="addTokenIDValue"
          innerRef={tokenIdRef}
          transfer={false}
          disabled={false}
        />
        <Input
          type="text"
          placeholder="Name"
          label="Token name"
          text="Enter token name"
          controlId="addTokenNameValue"
          innerRef={tokenNameRef}
          transfer={false}
          disabled={false}
        />
        <Input
          type="text"
          placeholder="Symbol"
          label="Token symbol"
          text="Enter token symbol"
          controlId="addTokenSymbolValue"
          innerRef={tokenSymbolRef}
          transfer={false}
          disabled={false}
        />
        <Input
          type="text"
          placeholder="Address"
          label="Token address"
          text="Enter token address"
          controlId="addTokenAddressValue"
          innerRef={tokenAddressRef}
          transfer={false}
          disabled={false}
        />
        <Btn text="Add token" type="submit" />
      </Form>
    </div>
  );
}
