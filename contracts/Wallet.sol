// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
* @dev This contract handles the global balances mapping of the dex, along with
* functions that enable the user to interact with the data storage
*/
contract Wallet is Context, Ownable  {

    using SafeMath for uint256;

    /**
    * @dev Modifier for deposit and withdraw functions to check if the token/ETH actually
    * exists in contract
    */
    modifier tokenExists(bytes32 _ticker) {
        require(tokens[_ticker].tokenAddress != address(0), "Token does not exist");
        _;
    }
    
    struct Token {
        bytes32 name;
        bytes32 ticker;
        address tokenAddress;
    }

    mapping (bytes32 => Token) public tokens;
    bytes32[] public tokenList;
    uint256 public tokenListCount = 0;

    mapping (address => mapping (bytes32 => uint256)) public balances;

    bytes32 constant ETH = bytes32("ETH");

    /**
    * @dev Add a token into the tokens mapping
    */
    function addToken(bytes32 _name, bytes32 _ticker, address _tokenAddress) external onlyOwner() {
        tokens[_ticker] = Token(_name, _ticker, _tokenAddress);
        tokenList.push(_ticker);
        tokenListCount = tokenListCount.add(1);
    }

    /**
    * @dev Deposit ETH into your account
    */
    function depositEth() public payable {
        balances[_msgSender()][ETH] = balances[_msgSender()][ETH].add(msg.value);
    }

    function withdrawEth(uint256 _amount) public payable returns (bool) {
        require(balances[_msgSender()][ETH] >= _amount, "Insufficient balance");
        balances[_msgSender()][ETH] = balances[_msgSender()][ETH].sub(_amount);
        (bool success,) = _msgSender().call{value: _amount}("");
        return success;
    }

    /**
    * @dev Deposit tokens to your account
    */
    function deposit(uint256 _amount, bytes32 _ticker) external tokenExists(_ticker) {
        IERC20(tokens[_ticker].tokenAddress).transferFrom(_msgSender(), address(this), _amount);
        balances[_msgSender()][_ticker] = balances[_msgSender()][_ticker].add(_amount);
    }

    /**
    * @dev Withdraw tokens from your account
    */
    function withdraw(uint256 _amount, bytes32 _ticker) external tokenExists(_ticker) {
        require(balances[_msgSender()][_ticker] >= _amount, "Insufficient balance.");
        balances[_msgSender()][_ticker] = balances[_msgSender()][_ticker].sub(_amount);
        IERC20(tokens[_ticker].tokenAddress).transfer(_msgSender(), _amount);
    }

}