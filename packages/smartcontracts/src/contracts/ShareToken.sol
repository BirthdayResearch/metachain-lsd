// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ShareToken is ERC20, Ownable {
  /**
   * @dev Initializes the ERC20 token with a `name` and a `symbol`.
   * @param name The name of the token.
   * @param symbol The symbol of the token.
   */
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  /**
   * @param account The address that will receive the minted tokens.
   * @param amount The number of tokens to be minted.
   *
   * Requirements:
   * - Only the owner can call this function.
   */
  function mint(address account, uint256 amount) external onlyOwner {
    _mint(account, amount);
  }

  /**
   * @param account The address from which tokens will be burned.
   * @param amount The number of tokens to be burned.
   *
   * Requirements:
   * - Only the owner can call this function.
   */
  function burn(address account, uint256 amount) external onlyOwner {
    _burn(account, amount);
  }
}
