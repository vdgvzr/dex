import AddTokenForm from "./AddTokenForm";

export default function Form({ type }) {
  let element;

  switch (type) {
    case "addToken":
      element = <AddTokenForm />;
      break;
  }

  return element;
}
