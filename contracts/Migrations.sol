// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Context.sol";

contract Migrations is Context {
  address public owner;
  uint256 public last_completed_migration;

  modifier restricted() {
    if (_msgSender() == owner) _;
  }

  constructor() {
    owner = _msgSender();
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
