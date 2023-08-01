// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Link is ERC20 {
    constructor() ERC20("Chainlink", "LINK") {
        _mint(_msgSender(), 1000000000000000000000);
    }
}

contract Doge is ERC20 {
    constructor() ERC20("Dogecoin", "DOGE") {
        _mint(_msgSender(), 1000000000000000000000);
    }
}

contract WrappedBtc is ERC20 {
    constructor() ERC20("Wrapped btc", "WBTC") {
        _mint(_msgSender(), 1000000000000000000000);
    }
}
