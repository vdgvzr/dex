// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Wallet is Context, Ownable  {

    modifier tokenExists(bytes32 _ticker) {
        require(tokens[_ticker].tokenAddress != address(0), "Token does not exist");
        _;
    }

    using SafeMath for uint256;

    struct Token {
        bytes32 name;
        bytes32 ticker;
        address tokenAddress;
    }

    mapping (bytes32 => Token) public tokens;
    bytes32[] public tokenList;

    mapping (address => mapping (bytes32 => uint256)) public balances;

    function addToken(bytes32 _name, bytes32 _ticker, address _tokenAddress) external onlyOwner() {
        tokens[_ticker] = Token(_name, _ticker, _tokenAddress);
        tokenList.push(_ticker);
    }

    function deposit(uint256 _amount, bytes32 _ticker) external tokenExists(_ticker) {
        IERC20(tokens[_ticker].tokenAddress).transferFrom(_msgSender(), address(this), _amount);
        balances[_msgSender()][_ticker] = balances[_msgSender()][_ticker].add(_amount);
    }

    function withdraw(uint256 _amount, bytes32 _ticker) external tokenExists(_ticker) {
        require(balances[_msgSender()][_ticker] >= _amount, "Insufficient balance.");
        balances[_msgSender()][_ticker] = balances[_msgSender()][_ticker].sub(_amount);
        IERC20(tokens[_ticker].tokenAddress).transfer(_msgSender(), _amount);
    }

}