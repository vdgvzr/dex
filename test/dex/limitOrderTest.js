const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract("Dex - limit orders", async (accounts) => {
  let DEX;
  let LINK;
  let LINK_NAME;
  let LINK_SYMBOL;

  before(async () => {
    DEX = await Dex.deployed();
    LINK = await Link.deployed();
    LINK_NAME = await web3.utils.fromUtf8(LINK.name());
    LINK_SYMBOL = await web3.utils.fromUtf8(LINK.symbol());

    await LINK.approve(DEX.address, 1000);
    await DEX.depositEth({ value: 3000 });
    await DEX.addToken(LINK_NAME, LINK_SYMBOL, LINK.address, {
      from: accounts[0],
    });
    await DEX.deposit(1000, LINK_SYMBOL);
  });

  describe("dex limit order functions", async () => {
    it("should throw an error if token balance is too low when creating BUY limit order", async () => {
      await truffleAssert.reverts(
        DEX.createLimitOrder(0, LINK_SYMBOL, 4000, 100)
      );
      await truffleAssert.passes(DEX.createLimitOrder(0, LINK_SYMBOL, 10, 1));
    });

    it("the BUY order book should be ordered by price from highest to lowest", async () => {
      await DEX.createLimitOrder(0, LINK_SYMBOL, 1, 300);
      await DEX.createLimitOrder(0, LINK_SYMBOL, 1, 100);
      await DEX.createLimitOrder(0, LINK_SYMBOL, 1, 200);

      let ORDERBOOK = await DEX.getOrderBook(LINK_SYMBOL, 0);
      assert(ORDERBOOK.length > 0);
      for (let i = 0; i < ORDERBOOK.length - 1; i++) {
        assert(
          ORDERBOOK[i].price <= ORDERBOOK[i + 1].price,
          "not right order in buy book"
        );
      }
    });

    it("the SELL order book should be ordered by price from lowest to highest", async () => {
      await DEX.createLimitOrder(1, LINK_SYMBOL, 1, 300);
      await DEX.createLimitOrder(1, LINK_SYMBOL, 1, 100);
      await DEX.createLimitOrder(1, LINK_SYMBOL, 1, 200);

      let ORDERBOOK = await DEX.getOrderBook(LINK_SYMBOL, 0);
      assert(ORDERBOOK.length > 0);
      for (let i = 0; i < ORDERBOOK.length - 1; i++) {
        assert(
          ORDERBOOK[i].price <= ORDERBOOK[i + 1].price,
          "not right order in sell book"
        );
      }
    });
  });
});
