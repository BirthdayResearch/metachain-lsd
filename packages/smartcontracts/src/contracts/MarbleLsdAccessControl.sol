// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @notice @dev
 * This error occurs when using Zero address
 */
error ZERO_ADDRESS();

abstract contract MarbleLsdAccessControl is AccessControlUpgradeable {
  bytes32 public constant REWARDS_DISTRIBUTER_ROLE =
    keccak256("REWARDS_DISTRIBUTER_ROLE");
  bytes32 public constant FINALIZE_ROLE = keccak256("FINALIZE_ROLE");
  bytes32 public constant ADMINISTRATOR_ROLE = keccak256("ADMINISTRATOR_ROLE");
}
