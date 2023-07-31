const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract("Wallet", async (accounts) => {
  let DEX;
  let LINK;
  let LINK_NAME;
  let LINK_SYMBOL;
  let ETH_SYMBOL = web3.utils.fromUtf8("ETH");

  before(async () => {
    DEX = await Dex.deployed();
    LINK = await Link.deployed();
    LINK_NAME = await web3.utils.fromUtf8(LINK.name());
    LINK_SYMBOL = await web3.utils.fromUtf8(LINK.symbol());
  });

  describe("wallet functions", async () => {
    it("should only be possible for owner to add tokens", async () => {
      await truffleAssert.passes(
        DEX.addToken(LINK_NAME, LINK_SYMBOL, LINK.address, {
          from: accounts[0],
        })
      );

      await truffleAssert.reverts(
        DEX.addToken(LINK_NAME, LINK_SYMBOL, LINK.address, {
          from: accounts[1],
        })
      );
    });

    it("should handle deposits correctly", async () => {
      await LINK.approve(DEX.address, 500);
      await DEX.deposit(100, LINK_SYMBOL);
      let balance = await DEX.balances(accounts[0], LINK_SYMBOL);
      console.log(LINK.address);
      assert.equal(balance.toNumber(), 100);
    });

    it("should handle ETH deposits correctly", async () => {
      await DEX.depositEth({ value: 100 });
      let balance = await DEX.balances(accounts[0], ETH_SYMBOL);
      assert.equal(balance.toNumber(), 100);
    });

    it("should handle withdrawals correctly", async () => {
      await truffleAssert.passes(DEX.withdraw(100, LINK_SYMBOL));
    });

    it("should handle faulty withdrawals correctly", async () => {
      await truffleAssert.reverts(DEX.withdraw(500, LINK_SYMBOL));
    });
  });
});
