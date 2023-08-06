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
  formatChainAsNum,
  formatFromBytes32,
} from "../utils/index";
import { ethers } from "ethers";

import Dex from "../../abis/Dex.json";
import {
  human_standard_token_abi,
  sepolia_abi,
} from "../assets/js/humanReadableAbi";
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

  const _loadWeb3 = useCallback(async () => {
    setIsLoading(true);

    window.web3 = new Web3(window.ethereum);
    const accounts = await window.web3.eth.getAccounts();
    const networkId = await window.web3.eth.net.getId();
    const dexNetworkData = Dex.networks[networkId];
    let chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (dexNetworkData) {
      // Get the contracts
      const dex = new window.web3.eth.Contract(Dex.abi, dexNetworkData.address);

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
          let tokenContract;

          if (formatChainAsNum(chainId) === 1337) {
            tokenContract = new window.web3.eth.Contract(
              human_standard_token_abi,
              tokenList[i].tokenAddress
            );
          } else {
            tokenContract = new window.web3.eth.Contract(
              sepolia_abi,
              tokenList[i].tokenAddress
            );
          }

          if (formatFromBytes32(tokenList[i].ticker) !== "ETH") {
            const balance = await dex?.methods
              .balances(accounts[0], tokenList[i].ticker)
              .call();

            let available = await tokenContract.methods
              .balanceOf(accounts[0], tokenList[i].name)
              .call();

            balancesList.push({
              coin: formatFromBytes32(tokenList[i].ticker),
              amount: formatBalance(balance),
              contract: tokenContract,
              available: available,
            });
          } else {
            const balance = await dex?.methods
              .balances(accounts[0], tokenList[i].ticker)
              .call();

            balancesList.push({
              coin: formatFromBytes32(tokenList[i].ticker),
              amount: formatBalance(balance),
            });
          }
        }
      }

      // Set global state vars
      setDex(dex);
      setOwner(owner);
      setTokens(tokenList);
      setBalances(balancesList);
    }

    setIsLoading(false);
  }, []);

  const loadWeb3 = useCallback(() => _loadWeb3(), [_loadWeb3]);

  // useCallback ensures that we don't uselessly re-create the _updateWallet function on every render
  const _updateWallet = useCallback(async (providedAccounts) => {
    const accounts =
      providedAccounts ||
      (await window.ethereum.request({ method: "eth_accounts" }));

    if (accounts.length === 0) {
      // If there are no accounts, then the user is disconnected
      if (window.location.pathname != "/") {
        window.location.href = "/";
      }
      setWallet(disconnectedState);
      return;
    }

    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );

    // For retreiving chain id hexes
    /* let oldChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    console.log(oldChainId); */

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
