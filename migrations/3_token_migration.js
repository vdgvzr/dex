const Link = artifacts.require("Link");
const Doge = artifacts.require("Doge");
const WrappedBtc = artifacts.require("WrappedBtc");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Link);
  await deployer.deploy(Doge);
  await deployer.deploy(WrappedBtc);
};
