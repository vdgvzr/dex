import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import {
  formatBalance,
  formatFromBytes32,
  formatToBytes32,
} from "../utils/index";
import { ethers } from "ethers";

import Dex from "../../abis/Dex.json";
import Link from "../../abis/Link.json";
import Doge from "../../abis/Doge.json";
import WrappedBtc from "../../abis/WrappedBtc.json";
import Web3 from "web3";

const disconnectedState = {
  accounts: [],
  balance: "",
  chainId: "",
};

export const MetaMaskContext = createContext(null);

export const MetaMaskContextProvider = ({ children }) => {
  // Global state
  const [hasProvider, setHasProvider] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [wallet, setWallet] = useState(disconnectedState);
  const [isLoading, setIsLoading] = useState(false);
  const [dex, setDex] = useState(null);
  const [link, setLink] = useState(null);
  const [doge, setDoge] = useState(null);
  const [wbtc, setWbtc] = useState(null);
  const [owner, setOwner] = useState("0x0");
  const [tokens, setTokens] = useState(null);
  const [balances, setBalances] = useState([]);

  const clearError = () => setErrorMessage("");
  const clearSuccess = () => setSuccessMessage("");

  useEffect(() => {
    setTimeout(() => {
      clearError();
    }, 5000);
  }, [errorMessage]);

  useEffect(() => {
    setTimeout(() => {
      clearSuccess();
    }, 5000);
  }, [successMessage]);

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

    /* let chainId = await window.ethereum.request({
      method: "eth_chainId",
    }); */

    let userProvider = new ethers.BrowserProvider(window.ethereum);
    let objectNetwork = await userProvider.getNetwork();
    let networkName = objectNetwork.name;
    const chainId = networkName.charAt(0).toUpperCase() + networkName.slice(1);

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

    window.web3 = new Web3(window.ethereum);
    const accounts = await window.web3.eth.getAccounts();
    const networkId = await window.web3.eth.net.getId();
    const dexNetworkData = Dex.networks[networkId];
    const linkNetworkData = Link.networks[networkId];
    const dogeNetworkData = Doge.networks[networkId];
    const wbtcNetworkData = WrappedBtc.networks[networkId];

    if (dexNetworkData) {
      // Get the contracts
      const dex = new window.web3.eth.Contract(Dex.abi, dexNetworkData.address);
      const link = new window.web3.eth.Contract(
        Link.abi,
        linkNetworkData.address
      );
      const doge = new window.web3.eth.Contract(
        Doge.abi,
        dogeNetworkData.address
      );
      const wbtc = new window.web3.eth.Contract(
        WrappedBtc.abi,
        wbtcNetworkData.address
      );

      // Get global vars
      const owner = await dex?.methods.owner().call();

      /////////// Tokens
      const tokenListCount = parseInt(
        await dex?.methods.tokenListCount().call()
      );
      const tokenList = [];
      for (let i = 0; i < tokenListCount; i++) {
        const token = await dex?.methods.tokenList(i).call();
        tokenList.push(await dex?.methods.tokens(token).call());
      }

      /////////// Balances
      const balancesList = [];
      if (accounts[0] != undefined) {
        for (let i = 0; i < tokenList.length; i++) {
          const balance = await dex?.methods
            .balances(accounts[0], tokenList[i].ticker)
            .call();

          balancesList.push({
            coin: formatFromBytes32(tokenList[i].ticker),
            amount: formatBalance(balance),
          });
        }
      }

      // Set global state vars
      setDex(dex);
      if (accounts[0] != undefined) {
        setLink({
          contract: link,
          available: await link.methods
            .balanceOf(accounts[0], formatToBytes32("LINK"))
            .call(),
        });
        setDoge({
          contract: doge,
          available: await doge.methods
            .balanceOf(accounts[0], formatToBytes32("DOGE"))
            .call(),
        });
        setWbtc({
          contract: wbtc,
          available: await wbtc.methods
            .balanceOf(accounts[0], formatToBytes32("WBTC"))
            .call(),
        });
      }
      setOwner(owner);
      setTokens(tokenList);
      setBalances(balancesList);
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
      setSuccessMessage("Metamask connected!");
    } catch (err) {
      setErrorMessage(err.message);
    }
    setIsConnecting(false);
  };

  // console.log(link.contract._address);
  // console.log(doge.contract._address);
  // console.log(wbtc.contract._address);

  return (
    <MetaMaskContext.Provider
      value={{
        wallet,
        hasProvider,
        error: !!errorMessage,
        success: !!successMessage,
        errorMessage,
        successMessage,
        isConnecting,
        isLoading,
        dex,
        link,
        doge,
        wbtc,
        owner,
        tokens,
        balances,
        connectMetaMask,
        clearError,
        clearSuccess,
        loadWeb3,
        updateWalletAndAccounts,
        setErrorMessage,
        setSuccessMessage,
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
