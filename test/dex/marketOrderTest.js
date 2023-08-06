const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");
const web3 = require("web3");
require("chai").use(require("chai-as-promised")).should();

contract("Dex", (accounts) => {
  let dex;
  let link;

  let linkSymbol = web3.utils.fromUtf8("LINK");
  let linkName = web3.utils.fromUtf8("Chainlink");

  before(async () => {
    dex = await Dex.deployed();
    link = await Link.deployed();

    await dex.addToken("link-chainlink", linkName, linkSymbol, link.address);
  });

  describe("market orders", async () => {
    it("Should throw an error when creating a sell market order without adequate token balance", async () => {
      let balance = await dex.balances(accounts[0], linkSymbol);
      assert.equal(balance.toNumber(), 0, "Initial LINK balance is not 0");
      await truffleAssert.reverts(dex.createMarketOrder(1, linkSymbol, 10));
    });

    it("Market orders can be submitted even if the order book is empty", async () => {
      await dex.depositEth({ value: 50000 });

      let orderbook = await dex.getOrderBook(linkSymbol, 0);
      assert(orderbook.length == 0, "Buy side Orderbook length is not 0");

      await truffleAssert.passes(dex.createMarketOrder(0, linkSymbol, 10));
    });

    it("Market orders should not fill more limit orders than the market order amount", async () => {
      let orderbook = await dex.getOrderBook(linkSymbol, 1);
      assert(
        orderbook.length == 0,
        "Sell side Orderbook should be empty at start of test"
      );

      await link.transfer(accounts[1], 150);
      await link.transfer(accounts[2], 150);
      await link.transfer(accounts[3], 150);

      await link.approve(dex.address, 50, { from: accounts[1] });
      await link.approve(dex.address, 50, { from: accounts[2] });
      await link.approve(dex.address, 50, { from: accounts[3] });

      await dex.deposit(50, linkSymbol, { from: accounts[1] });
      await dex.deposit(50, linkSymbol, { from: accounts[2] });
      await dex.deposit(50, linkSymbol, { from: accounts[3] });

      await dex.createLimitOrder(1, linkSymbol, 5, 300, {
        from: accounts[1],
      });
      await dex.createLimitOrder(1, linkSymbol, 5, 400, {
        from: accounts[2],
      });
      await dex.createLimitOrder(1, linkSymbol, 5, 500, {
        from: accounts[3],
      });

      await dex.createMarketOrder(0, linkSymbol, 10);

      orderbook = await dex.getOrderBook(linkSymbol, 1);
      assert(
        orderbook.length == 1,
        "Sell side Orderbook should only have 1 order left"
      );
      assert(orderbook[0].filled == 0, "Sell side order should have 0 filled");
    });

    it("Market orders should be filled until the order book is empty", async () => {
      let orderbook = await dex.getOrderBook(linkSymbol, 1);
      assert(
        orderbook.length == 1,
        "Sell side Orderbook should have 1 order left"
      );

      await dex.createLimitOrder(1, linkSymbol, 5, 400, {
        from: accounts[1],
      });
      await dex.createLimitOrder(1, linkSymbol, 5, 500, {
        from: accounts[2],
      });

      let balanceBefore = await dex.balances(accounts[0], linkSymbol);
      await dex.createMarketOrder(0, linkSymbol, 50);
      let balanceAfter = await dex.balances(accounts[0], linkSymbol);
      assert.equal(balanceBefore.toNumber() + 15, balanceAfter.toNumber());
    });

    it("The eth balance of the buyer should decrease with the filled amount", async () => {
      await link.approve(dex.address, 500, { from: accounts[1] });
      await dex.createLimitOrder(1, linkSymbol, 1, 300, {
        from: accounts[1],
      });

      let balanceBefore = await dex.balances(
        accounts[0],
        web3.utils.fromUtf8("ETH")
      );
      await dex.createMarketOrder(0, linkSymbol, 1);
      let balanceAfter = await dex.balances(
        accounts[0],
        web3.utils.fromUtf8("ETH")
      );

      assert.equal(balanceBefore.toNumber() - 300, balanceAfter.toNumber());
    });

    it("The token balances of the limit order sellers should decrease with the filled amounts.", async () => {
      let orderbook = await dex.getOrderBook(linkSymbol, 1); //Get sell side orderbook
      assert(
        orderbook.length == 0,
        "Sell side Orderbook should be empty at start of test"
      );

      await link.approve(dex.address, 500, { from: accounts[2] });
      await dex.deposit(100, linkSymbol, {
        from: accounts[2],
      });

      await dex.createLimitOrder(1, linkSymbol, 1, 300, {
        from: accounts[1],
      });
      await dex.createLimitOrder(1, linkSymbol, 1, 400, {
        from: accounts[2],
      });

      let account1balanceBefore = await dex.balances(accounts[1], linkSymbol);
      let account2balanceBefore = await dex.balances(accounts[2], linkSymbol);

      await dex.createMarketOrder(0, linkSymbol, 2);

      let account1balanceAfter = await dex.balances(accounts[1], linkSymbol);
      let account2balanceAfter = await dex.balances(accounts[2], linkSymbol);

      assert.equal(
        account1balanceBefore.toNumber() - 1,
        account1balanceAfter.toNumber()
      );
      assert.equal(
        account2balanceBefore.toNumber() - 1,
        account2balanceAfter.toNumber()
      );
    });

    it("Filled limit orders should be removed from the orderbook", async () => {
      await link.approve(dex.address, 500);
      await dex.deposit(50, linkSymbol);

      await dex.depositEth({ value: 10000 });

      let orderbook = await dex.getOrderBook(linkSymbol, 1);

      await dex.createLimitOrder(1, linkSymbol, 1, 300);
      await dex.createMarketOrder(0, linkSymbol, 1);

      orderbook = await dex.getOrderBook(linkSymbol, 1);
      assert(
        orderbook.length == 0,
        "Sell side Orderbook should be empty after trade"
      );
    });

    it("Limit orders filled property should be set correctly after a trade", async () => {
      let orderbook = await dex.getOrderBook(linkSymbol, 1);
      assert(
        orderbook.length == 0,
        "Sell side Orderbook should be empty at start of test"
      );

      await dex.createLimitOrder(1, linkSymbol, 5, 300, {
        from: accounts[1],
      });
      await dex.createMarketOrder(0, linkSymbol, 2);

      orderbook = await dex.getOrderBook(linkSymbol, 1);
      assert.equal(orderbook[0].filled, 2);
      assert.equal(orderbook[0].amount, 5);
    });

    it("Should throw an error when creating a buy market order without adequate ETH balance", async () => {
      let balance = await dex.balances(accounts[4], web3.utils.fromUtf8("ETH"));
      assert.equal(balance.toNumber(), 0, "Initial ETH balance is not 0");
      await dex.createLimitOrder(1, linkSymbol, 5, 300, {
        from: accounts[1],
      });

      await truffleAssert.reverts(
        dex.createMarketOrder(0, linkSymbol, 5, {
          from: accounts[4],
        })
      );
    });
  });
});
