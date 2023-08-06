const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");
const web3 = require("web3");
require("chai").use(require("chai-as-promised")).should();

contract("Dex", (accounts) => {
  let account = accounts[0];

  let dex;
  let link;

  let linkSymbol = web3.utils.fromUtf8("LINK");
  let linkName = web3.utils.fromUtf8("Chainlink");

  before(async () => {
    dex = await Dex.deployed();
    link = await Link.deployed();
  });

  describe("limit orers", async () => {
    it("should throw an error if ETH balance is too low when creating BUY limit order", async () => {
      await truffleAssert.reverts(dex.createLimitOrder(0, linkSymbol, 10, 1));
    });

    it("should throw an error if token balance is too low when creating SELL limit order", async () => {
      await truffleAssert.reverts(dex.createLimitOrder(1, linkSymbol, 10, 1));
    });

    it("The BUY order book should be ordered on price from highest to lowest starting at index 0", async () => {
      await dex.addToken("link-chainlink", linkName, linkSymbol, link.address, {
        from: account,
      });
      await link.approve(dex.address, 500);
      await dex.deposit(500, linkSymbol);
      await dex.depositEth({ value: 3000 });
      await dex.createLimitOrder(0, linkSymbol, 10, 300);
      await dex.createLimitOrder(0, linkSymbol, 10, 100);
      await dex.createLimitOrder(0, linkSymbol, 10, 200);
      let orderbook = await dex.getOrderBook(linkSymbol, 0);
      assert(orderbook.length > 0);
      for (let i = 0; i < orderbook.length - 1; i++) {
        assert(
          orderbook[i].price >= orderbook[i + 1].price,
          "not right order in buy book"
        );
      }
    });

    it("The SELL order book should be ordered on price from lowest to highest starting at index 0", async () => {
      await dex.addToken("link-chainlink", linkName, linkSymbol, link.address, {
        from: account,
      });
      await link.approve(dex.address, 500);
      await dex.createLimitOrder(1, linkSymbol, 1, 300);
      await dex.createLimitOrder(1, linkSymbol, 1, 100);
      await dex.createLimitOrder(1, linkSymbol, 1, 200);

      let orderbook = await dex.getOrderBook(linkSymbol, 1);
      assert(orderbook.length > 0);

      for (let i = 0; i < orderbook.length - 1; i++) {
        assert(
          orderbook[i].price <= orderbook[i + 1].price,
          "not right order in sell book"
        );
      }
    });

    it("deletes orders correctly", async () => {
      await dex.addToken("link-chainlink", linkName, linkSymbol, link.address, {
        from: account,
      });
      await link.approve(dex.address, 500);
      await dex.createLimitOrder(1, linkSymbol, 1, 300);
      await dex.createLimitOrder(1, linkSymbol, 1, 100);
      await dex.createLimitOrder(1, linkSymbol, 1, 200);

      await truffleAssert.passes(dex.deleteOrder(4, linkSymbol, 1));
    });
  });
});
