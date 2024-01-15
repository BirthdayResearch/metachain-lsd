// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ReceiptToken is ERC20, Ownable {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
  }

  function decimals() public view virtual override returns (uint8) {
    return 8;
  }
  
  function mint(address account, uint256 amount) external onlyOwner {
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) external onlyOwner {
    _burn(account, amount);
  }
}