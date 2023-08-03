// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "./Wallet.sol";

contract Dex is Wallet {

    using SafeMath for uint256;

    enum OrderType {
        BUY,
        SELL
    }
    
    struct Order {
        uint256 id;
        address trader;
        OrderType orderType;
        bytes32 symbol;
        uint256 amount;
        uint256 price;
        uint256 filled;
    }

    address payable constant FEE_ADDRESS = payable(0x7eaAFED0E594a1ac12f50d59847eBB784c66c45E);

    uint public nextOrderId = 0;

    mapping (bytes32 => mapping (uint => Order[])) public orderBook;

    function getOrderBook(bytes32 _symbol, OrderType _orderType) view public returns (Order[] memory) {
        return orderBook[_symbol][uint(_orderType)];
    }

    function deleteOrder(uint256 _orderId, bytes32 _symbol, OrderType _orderType) public returns(bool success) {
        delete orderBook[_symbol][uint(_orderType)][_orderId];
        return success;
    }

    function createLimitOrder(OrderType _orderType,  bytes32 _symbol, uint256 _amount, uint256 _price) public {
        if (_orderType == OrderType.BUY) {
            require(balances[_msgSender()]["ETH"] >= _amount.mul(_price.div(100)));
        } else if (_orderType == OrderType.SELL) {
            require(balances[_msgSender()][_symbol] >= _amount);
        }

        Order[] storage orders = orderBook[_symbol][uint(_orderType)];

        orders.push(
            Order(nextOrderId, _msgSender(), _orderType, _symbol, _amount, _price.div(100), 0)
        );

        // Bubble sort
        if (orders.length > 0) {
            if (_orderType == OrderType.BUY) {
                for (uint256 i=orders.length-1; i>0; i--) {
                    if (orders[i-1].price > orders[i].price) {
                        Order memory orderToMove = orders[i-1];
                        orders[i-1] = orders[i];
                        orders[i] = orderToMove;
                    }
                }
            } else if (_orderType == OrderType.SELL) {
                for (uint256 i=orders.length-1; i>0; i--) {
                    if (orders[i-1].price < orders[i].price) {
                        Order memory orderToMove = orders[i-1];
                        orders[i-1] = orders[i];
                        orders[i] = orderToMove;
                    }
                }
            }
        }

        nextOrderId = nextOrderId.add(1);
    }

    function createMarketOrder(OrderType _orderType,  bytes32 _symbol, uint256 _amount) public {
        if (_orderType == OrderType.SELL) {
            require(balances[_msgSender()][_symbol] >= _amount, "Insufficient balance");
        }

        uint negateOrderType;
        if (_orderType == OrderType.BUY) {
            negateOrderType = 1;
        } else {
            negateOrderType = 0;
        }

        Order[] storage orders = orderBook[_symbol][uint(negateOrderType)];

        uint orderFilled;
        for (uint256 i = 0; i < orders.length && orderFilled < _amount; i++) {
            uint leftToFill = _amount.sub(orderFilled);
            uint availableToFill = orders[i].amount.sub(orders[i].filled);
            uint filled = 0;

            if(availableToFill > leftToFill) {
                filled = leftToFill;
            } else {
                filled = availableToFill;
            }

            orderFilled = orderFilled.add(filled);
            orders[i].filled = orders[i].filled.add(filled);
            uint cost = filled.mul(orders[i].price);

            if (_orderType == OrderType.BUY) {
                require(balances[_msgSender()][ETH] >= cost);
                balances[_msgSender()][_symbol] = balances[_msgSender()][_symbol].add(filled);
                balances[_msgSender()][ETH] = balances[_msgSender()][ETH].sub(cost);

                balances[orders[i].trader][_symbol] = balances[orders[i].trader][_symbol].sub(filled);
                balances[orders[i].trader][ETH] = balances[orders[i].trader][ETH].add(cost);

                _transfer(FEE_ADDRESS, _amount.div(100));
            } else if (_orderType == OrderType.SELL) {
                balances[_msgSender()][_symbol] = balances[_msgSender()][_symbol].sub(filled);
                balances[_msgSender()][ETH] = balances[_msgSender()][ETH].add(cost);

                balances[orders[i].trader][_symbol] = balances[orders[i].trader][_symbol].add(filled);
                balances[orders[i].trader][ETH] = balances[orders[i].trader][ETH].sub(cost);

                _transfer(FEE_ADDRESS, _amount.div(100));
            }
        }

        while(orders.length > 0 && orders[0].filled == orders[0].amount) {
            for (uint256 i = 0; i < orders.length -1; i++) {
                orders[i] = orders[i+1];
            }
            orders.pop();
        }
    }

    function _transfer(address payable recipient, uint amount) private returns(bool) {
        (bool success,) = recipient.call{value: amount}("");
        return success;
    }
}