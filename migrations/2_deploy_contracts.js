const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");

module.exports = async function (deployer) {
  await deployer.deploy(Dex);
  await deployer.deploy(Link);
};
