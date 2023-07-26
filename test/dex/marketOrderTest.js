const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract("Dex - market order orders", async (accounts) => {
  let DEX;
  let LINK;
  let LINK_NAME;
  let LINK_SYMBOL;

  before(async () => {
    DEX = await Dex.deployed();
    LINK = await Link.deployed();
    LINK_NAME = await web3.utils.fromUtf8(LINK.name());
    LINK_SYMBOL = await web3.utils.fromUtf8(LINK.symbol());
  });

  describe("dex market functions", async () => {
    it("Should throw an error when creating a sell market order without adequate token balance", async () => {
      let balance = await DEX.balances(accounts[0], LINK_SYMBOL);
      assert.equal(balance.toNumber(), 0, "Initial LINK balance is not 0");

      await truffleAssert.reverts(DEX.createMarketOrder(1, LINK_SYMBOL, 10));
    });

    it("Market orders can be submitted even if the order book is empty", async () => {
      await DEX.depositEth({ value: 50000 });

      let orderbook = await DEX.getOrderBook(LINK_SYMBOL, 0); //Get buy side orderbook
      assert(orderbook.length == 0, "Buy side Orderbook length is not 0");

      await truffleAssert.passes(DEX.createMarketOrder(0, LINK_SYMBOL, 10));
    });

    it("Market orders should not fill more limit orders than the market order amount", async () => {
      let orderbook = await DEX.getOrderBook(LINK_SYMBOL, 1); //Get sell side orderbook
      assert(
        orderbook.length == 0,
        "Sell side Orderbook should be empty at start of test"
      );

      await DEX.addToken(LINK_NAME, LINK_SYMBOL, LINK.address);

      //Send LINK tokens to accounts 1, 2, 3 from account 0
      await LINK.transfer(accounts[1], 150);
      await LINK.transfer(accounts[2], 150);
      await LINK.transfer(accounts[3], 150);

      //Approve DEX for accounts 1, 2, 3
      await LINK.approve(DEX.address, 50, { from: accounts[1] });
      await LINK.approve(DEX.address, 50, { from: accounts[2] });
      await LINK.approve(DEX.address, 50, { from: accounts[3] });

      //Deposit LINK into DEX for accounts 1, 2, 3
      await DEX.deposit(50, LINK_SYMBOL, { from: accounts[1] });
      await DEX.deposit(50, LINK_SYMBOL, { from: accounts[2] });
      await DEX.deposit(50, LINK_SYMBOL, { from: accounts[3] });

      //Fill up the sell order book
      await DEX.createLimitOrder(1, LINK_SYMBOL, 5, 300, {
        from: accounts[1],
      });
      await DEX.createLimitOrder(1, LINK_SYMBOL, 5, 400, {
        from: accounts[2],
      });
      await DEX.createLimitOrder(1, LINK_SYMBOL, 5, 500, {
        from: accounts[3],
      });

      //Create market order that should fill 2/3 orders in the book
      await DEX.createMarketOrder(0, LINK_SYMBOL, 10);

      orderbook = await DEX.getOrderBook(LINK_SYMBOL, 1); //Get sell side orderbook
      assert(
        orderbook.length == 1,
        "Sell side Orderbook should only have 1 order left"
      );
      assert(orderbook[0].filled == 0, "Sell side order should have 0 filled");
    });

    it("Market orders should be filled until the order book is empty", async () => {
      let orderbook = await DEX.getOrderBook(LINK_SYMBOL, 1); //Get sell side orderbook
      assert(
        orderbook.length == 1,
        "Sell side Orderbook should have 1 order left"
      );

      //Fill up the sell order book again
      await DEX.createLimitOrder(1, LINK_SYMBOL, 5, 400, {
        from: accounts[1],
      });
      await DEX.createLimitOrder(1, LINK_SYMBOL, 5, 500, {
        from: accounts[2],
      });

      //check buyer link balance before link purchase
      let balanceBefore = await DEX.balances(accounts[0], LINK_SYMBOL);

      //Create market order that could fill more than the entire order book (15 link)
      await DEX.createMarketOrder(0, LINK_SYMBOL, 50);

      //check buyer link balance after link purchase
      let balanceAfter = await DEX.balances(accounts[0], LINK_SYMBOL);

      //Buyer should have 15 more link after, even though order was for 50.
      assert.equal(balanceBefore.toNumber() + 15, balanceAfter.toNumber());
    });

    it("The eth balance of the buyer should decrease with the filled amount", async () => {
      //Seller deposits link and creates a sell limit order for 1 link for 300 wei
      await LINK.approve(DEX.address, 500, { from: accounts[1] });
      await DEX.createLimitOrder(1, LINK_SYMBOL, 1, 300, {
        from: accounts[1],
      });

      //Check buyer ETH balance before trade
      let balanceBefore = await DEX.balances(
        accounts[0],
        web3.utils.fromUtf8("ETH")
      );
      await DEX.createMarketOrder(0, LINK_SYMBOL, 1);
      let balanceAfter = await DEX.balances(
        accounts[0],
        web3.utils.fromUtf8("ETH")
      );

      assert.equal(balanceBefore.toNumber() - 300, balanceAfter.toNumber());
    });

    it("The token balances of the limit order sellers should decrease with the filled amounts.", async () => {
      let orderbook = await DEX.getOrderBook(LINK_SYMBOL, 1); //Get sell side orderbook
      assert(
        orderbook.length == 0,
        "Sell side Orderbook should be empty at start of test"
      );

      //Seller Account[2] deposits link
      await LINK.approve(DEX.address, 500, { from: accounts[2] });
      await DEX.deposit(100, LINK_SYMBOL, {
        from: accounts[2],
      });

      await DEX.createLimitOrder(1, LINK_SYMBOL, 1, 300, {
        from: accounts[1],
      });
      await DEX.createLimitOrder(1, LINK_SYMBOL, 1, 400, {
        from: accounts[2],
      });

      //Check sellers Link balances before trade
      let account1balanceBefore = await DEX.balances(accounts[1], LINK_SYMBOL);
      let account2balanceBefore = await DEX.balances(accounts[2], LINK_SYMBOL);

      //Account[0] created market order to buy up both sell orders
      await DEX.createMarketOrder(0, LINK_SYMBOL, 2);

      //Check sellers Link balances after trade
      let account1balanceAfter = await DEX.balances(accounts[1], LINK_SYMBOL);
      let account2balanceAfter = await DEX.balances(accounts[2], LINK_SYMBOL);

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
      await DEX.addToken(LINK_NAME, LINK_SYMBOL, LINK.address);

      //Seller deposits link and creates a sell limit order for 1 link for 300 wei
      await LINK.approve(DEX.address, 500);
      await DEX.deposit(50, LINK_SYMBOL);

      await DEX.depositEth({ value: 10000 });

      let orderbook = await DEX.getOrderBook(LINK_SYMBOL, 1); //Get sell side orderbook

      await DEX.createLimitOrder(1, LINK_SYMBOL, 1, 300);
      await DEX.createMarketOrder(0, LINK_SYMBOL, 1);

      orderbook = await DEX.getOrderBook(LINK_SYMBOL, 1); //Get sell side orderbook
      assert(
        orderbook.length == 0,
        "Sell side Orderbook should be empty after trade"
      );
    });

    it("Limit orders filled property should be set correctly after a trade", async () => {
      let orderbook = await DEX.getOrderBook(LINK_SYMBOL, 1); //Get sell side orderbook
      assert(
        orderbook.length == 0,
        "Sell side Orderbook should be empty at start of test"
      );

      await DEX.createLimitOrder(1, LINK_SYMBOL, 5, 300, {
        from: accounts[1],
      });
      await DEX.createMarketOrder(0, LINK_SYMBOL, 2);

      orderbook = await DEX.getOrderBook(LINK_SYMBOL, 1); //Get sell side orderbook
      assert.equal(orderbook[0].filled, 2);
      assert.equal(orderbook[0].amount, 5);
    });

    it("Should throw an error when creating a buy market order without adequate ETH balance", async () => {
      let balance = await DEX.balances(accounts[4], web3.utils.fromUtf8("ETH"));
      assert.equal(balance.toNumber(), 0, "Initial ETH balance is not 0");
      await DEX.createLimitOrder(1, LINK_SYMBOL, 5, 300, {
        from: accounts[1],
      });

      await truffleAssert.reverts(
        DEX.createMarketOrder(0, LINK_SYMBOL, 5, {
          from: accounts[4],
        })
      );
    });
  });
});
