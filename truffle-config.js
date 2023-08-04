const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraKey = require("./secret.json").infuraKey;
const mnemonic = require("./secret.json").secret;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(
          mnemonic,
          "https://goerli.infura.io/v3/" + infuraKey
        );
      },
      network_id: "5",
      gas: 4465030,
      gasPrice: 10000000000,
    },
    sepolia: {
      provider: () => {
        return new HDWalletProvider(
          mnemonic,
          "https://sepolia.infura.io/v3/" + infuraKey
        );
      },
      network_id: "11155111",
      gas: 4000000,
      gasPrice: 10000000000,
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./abis/",
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200, // Default: 200
        },
      },
    },
  },
};
