import { ethers } from "ethers";

export const formatBalance = (rawBalance) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr) => {
  return (
    addr && addr.slice(0, 6) + "..." + addr.slice(addr.length - 4, addr.length)
  );
};

export const formatToBytes32 = (str) => {
  return ethers.encodeBytes32String(str);
};

export const formatFromBytes32 = (str) => {
  return ethers.decodeBytes32String(str);
};

export const isOwner = (wallet, owner) => {
  if (wallet.accounts[0] != undefined && owner != undefined) {
    return owner.toUpperCase() === wallet.accounts[0].toUpperCase();
  }
};
