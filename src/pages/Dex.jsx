import { useMetaMask } from "../hooks/useMetamask";

export default function Dex() {
  const { isLoading, dex } = useMetaMask();
  return <div>{!isLoading && dex?._address}</div>;
}
