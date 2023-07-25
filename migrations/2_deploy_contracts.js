const Wallet = artifacts.require("Wallet");
const Link = artifacts.require("Link");

module.exports = async function (deployer) {
  await deployer.deploy(Wallet);
  await deployer.deploy(Link);

  let wallet = await Wallet.deployed();
  let link = await Link.deployed();

  const linkName = web3.utils.fromUtf8(link.name());
  const linkSymbol = web3.utils.fromUtf8(link.symbol());

  await wallet.addToken(linkName, linkSymbol, link.address);
  await link.approve(wallet.address, 500);
  await wallet.deposit(100, linkSymbol);
};
