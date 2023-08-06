const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");
const web3 = require("web3");
require("chai").use(require("chai-as-promised")).should();

contract("Wallet", (accounts) => {
  let account = accounts[0];

  let dex;
  let link;

  let ethSymbol = web3.utils.fromUtf8("ETH");
  let linkSymbol = web3.utils.fromUtf8("LINK");
  let linkName = web3.utils.fromUtf8("Chainlink");

  before(async () => {
    dex = await Dex.deployed();
    link = await Link.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await dex.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("token management", async () => {
    let addResult;
    let deleteResult;
    let tokenListCount;
    let tokens;

    before(async () => {
      addResult = await dex.addToken(
        "link-chainlink",
        linkName,
        linkSymbol,
        "0x212e72d2438BfbF3D472FEFA134600196b816b75",
        { from: account }
      );
      deleteResult = await dex.deleteToken(ethSymbol, 0, {
        from: account,
      });
      tokenListCount = await dex.tokenListCount();
      tokens = await dex.tokens(ethSymbol);
    });

    it("should only be possible for the owner to add a token", async () => {
      // Success
      await truffleAssert.passes(
        dex.addToken("link-chainlink", linkName, linkSymbol, link.address, {
          from: account,
        })
      );

      // Failure
      await truffleAssert.reverts(
        dex.addToken("link-chainlink", linkName, linkSymbol, link.address, {
          from: accounts[1],
        })
      );
    });

    it("adds tokens successfully", async () => {
      assert.equal(tokenListCount.toNumber(), 1);
      const event = addResult.logs[0].args;
      assert.equal(event._id, "link-chainlink", "id is correct");
      assert.equal(
        event._name,
        "0x436861696e6c696e6b0000000000000000000000000000000000000000000000",
        "name is correct"
      );
      assert.equal(
        event._ticker,
        "0x4c494e4b00000000000000000000000000000000000000000000000000000000",
        "ticker is correct"
      );
      assert.equal(
        event._tokenAddress,
        "0x212e72d2438BfbF3D472FEFA134600196b816b75",
        "address is correct"
      );
    });

    it("deletes tokens successfully", async () => {
      const event = deleteResult.logs[0].args;
      assert.equal(tokens[event._ticker], undefined);
    });
  });

  describe("deposits and withdrawals", async () => {
    before(async () => {});

    it("should handle ETH deposits correctly", async () => {
      await dex.depositEth({ value: 1 });
      let balance = await dex.balances(account, ethSymbol);
      assert.equal(balance.toNumber(), 1);
    });

    it("should handle token deposits correctly", async () => {
      await link.approve(dex.address, 1000);
      await dex.deposit(500, linkSymbol);
      let balance = await dex.balances(account, linkSymbol);
      assert.equal(balance.toNumber(), 500);
    });

    it("should handle ETH withdrawals correctly", async () => {
      await dex.withdrawEth(1);
      let balance = await dex.balances(account, ethSymbol);
      assert.equal(balance.toNumber(), 0);
    });

    it("should handle token withdrawals correctly", async () => {
      await truffleAssert.passes(dex.withdraw(100, linkSymbol));
    });
  });
});
