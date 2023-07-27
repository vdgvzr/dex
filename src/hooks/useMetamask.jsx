import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { formatBalance } from "../utils/index";

import Dex from "../../abis/Dex.json";
import Web3 from "web3";

const disconnectedState = {
  accounts: [],
  balance: "",
  chainId: "",
};

export const MetaMaskContext = createContext(null);

export const MetaMaskContextProvider = ({ children }) => {
  const [hasProvider, setHasProvider] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [wallet, setWallet] = useState(disconnectedState);
  const [isLoading, setIsLoading] = useState(false);
  const [dex, setDex] = useState(null);
  const clearError = () => setErrorMessage("");

  // useCallback ensures that we don't uselessly re-create the _updateWallet function on every render
  const _updateWallet = useCallback(async (providedAccounts) => {
    const accounts =
      providedAccounts ||
      (await window.ethereum.request({ method: "eth_accounts" }));

    if (accounts.length === 0) {
      // If there are no accounts, then the user is disconnected
      setWallet(disconnectedState);
      return;
    }

    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    setWallet({ accounts, balance, chainId });
  }, []);

  const updateWalletAndAccounts = useCallback(
    () => _updateWallet(),
    [_updateWallet]
  );
  const updateWallet = useCallback(
    (accounts) => _updateWallet(accounts),
    [_updateWallet]
  );

  const _loadWeb3 = useCallback(async () => {
    setIsLoading(true);

    try {
      window.web3 = new Web3(window.ethereum);
      const networkId = await window.web3.eth.net.getId();
      const networkData = Dex.networks[networkId];

      if (networkData) {
        const dex = new window.web3.eth.Contract(Dex.abi, networkData.address);
        setDex(dex);
      }
    } catch (err) {
      setErrorMessage(err);
    }

    setIsLoading(false);
  }, []);

  const loadWeb3 = useCallback(() => _loadWeb3(), [_loadWeb3]);

  /**
   * This logic checks if MetaMask is installed. If it is, then we setup some
   * event handlers to update the wallet state when MetaMask changes. The function
   * returned from useEffect is used as a "clean-up": in there, we remove the event
   * handlers whenever the MetaMaskProvider is unmounted.
   */
  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(provider);

      if (provider) {
        updateWalletAndAccounts();
        loadWeb3();
        window.ethereum.on("accountsChanged", updateWallet);
        window.ethereum.on("accountsChanged", loadWeb3);
        window.ethereum.on("chainChanged", updateWalletAndAccounts);
        window.ethereum.on("chainChanged", loadWeb3);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", updateWallet);
      window.ethereum?.removeListener("accountsChanged", loadWeb3);
      window.ethereum?.removeListener("chainChanged", updateWalletAndAccounts);
      window.ethereum?.removeListener("chainChanged", loadWeb3);
    };
  }, [updateWallet, updateWalletAndAccounts, loadWeb3]);

  const connectMetaMask = async () => {
    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      clearError();
      updateWallet(accounts);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setIsConnecting(false);
  };

  return (
    <MetaMaskContext.Provider
      value={{
        wallet,
        hasProvider,
        error: !!errorMessage,
        errorMessage,
        isConnecting,
        isLoading,
        dex,
        connectMetaMask,
        clearError,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error(
      'useMetaMask must be used within a "MetaMaskContextProvider"'
    );
  }
  return context;
};
