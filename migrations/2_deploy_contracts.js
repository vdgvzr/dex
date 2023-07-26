const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");

module.exports = async function (deployer) {
  await deployer.deploy(Dex);
  await deployer.deploy(Link);

  /* let dex = await Dex.deployed();
  let link = await Link.deployed();

  const linkName = web3.utils.fromUtf8(link.name());
  const linkSymbol = web3.utils.fromUtf8(link.symbol());

  await dex.addToken(linkName, linkSymbol, link.address);
  await link.approve(dex.address, 500);
  await dex.deposit(100, linkSymbol); */
};
