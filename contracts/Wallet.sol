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
    * Events
    */
    event TokenAdded(string _id, bytes32 _name, bytes32 _ticker, address _tokenAddress);
    event TokenDeleted(bytes32 _ticker, uint256 _index);
    event DepositEth(uint256 _value);
    event WithdrawEth(uint256 _amount);
    event DepositTokens(uint256 _amount, bytes32 _ticker);
    event WithdrawTokens(uint256 _amount, bytes32 _ticker);

    /**
    * @dev Modifier for deposit and withdraw functions to check if the token/ETH actually
    * exists in contract
    */
    modifier tokenExists(bytes32 _ticker) {
        require(tokens[_ticker].tokenAddress != address(0), "Token does not exist");
        _;
    }
    
    struct Token {
        string id;
        bytes32 name;
        bytes32 ticker;
        address tokenAddress;
    }

    mapping (bytes32 => Token) public tokens;
    bytes32[] public tokenList;
    uint256 public tokenListCount = 0;

    mapping (address => mapping (bytes32 => uint256)) public balances;

    bytes32 constant ETH = bytes32("ETH");

    constructor() {
        // Initialise with ETH
        addToken(
            "eth-ethereum",
            0x457468657265756d000000000000000000000000000000000000000000000000, 
            0x4554480000000000000000000000000000000000000000000000000000000000,
            0x0000000000000000000000000000000000000000
        );
    }

    /**
    * @dev Add a token into the tokens mapping
    */
    function addToken(string memory _id, bytes32 _name, bytes32 _ticker, address _tokenAddress) public onlyOwner() {
        tokens[_ticker] = Token(_id, _name, _ticker, _tokenAddress);
        tokenList.push(_ticker);
        tokenListCount++;
        emit TokenAdded(_id, _name, _ticker, _tokenAddress);
    }

    function deleteToken(bytes32 _ticker, uint256 _index) public onlyOwner() {
        delete tokens[_ticker];
        tokenList[_index] = tokenList[tokenList.length - 1];
        tokenList.pop();
        tokenListCount--;
        emit TokenDeleted(_ticker, _index);
    }

    /**
    * @dev Deposit ETH into your account
    */
    function depositEth() public payable {
        balances[_msgSender()][ETH] = balances[_msgSender()][ETH].add(msg.value);
        emit DepositEth(msg.value);
    }

    /**
    * @dev Withdraw ETH from your account
    */
    function withdrawEth(uint256 _amount) public payable returns (bool) {
        require(balances[_msgSender()][ETH] >= _amount, "Insufficient balance");
        balances[_msgSender()][ETH] = balances[_msgSender()][ETH].sub(_amount);
        (bool success,) = _msgSender().call{value: _amount}("");
        return success;
    }

    /**
    * @dev Deposit tokens to your account
    */
    function deposit(uint256 _amount, bytes32 _ticker) public tokenExists(_ticker) {
        IERC20(tokens[_ticker].tokenAddress).transferFrom(_msgSender(), address(this), _amount);
        balances[_msgSender()][_ticker] = balances[_msgSender()][_ticker].add(_amount);
        emit DepositTokens(_amount, _ticker);
    }

    /**
    * @dev Withdraw tokens from your account
    */
    function withdraw(uint256 _amount, bytes32 _ticker) public tokenExists(_ticker) {
        require(balances[_msgSender()][_ticker] >= _amount, "Insufficient balance.");
        balances[_msgSender()][_ticker] = balances[_msgSender()][_ticker].sub(_amount);
        IERC20(tokens[_ticker].tokenAddress).transfer(_msgSender(), _amount);
        emit WithdrawTokens(_amount, _ticker);
    }

}