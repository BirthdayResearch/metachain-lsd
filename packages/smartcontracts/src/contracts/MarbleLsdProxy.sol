// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract MarbleLsdProxy is ERC1967Proxy {
  /**
   * @dev Initializes the proxy contract with an implementation address and initialization data.
   * @param _logic The address of the implementation contract.
   * @param _data The encoded function call that initializes the proxy.
   */
  constructor(
    address _logic,
    bytes memory _data
  ) payable ERC1967Proxy(_logic, _data) {}
}
