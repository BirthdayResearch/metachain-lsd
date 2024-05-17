// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @notice @dev
 * This error occurs when using Zero address
 */
  error ZERO_ADDRESS();

abstract contract MarbleLsdAccessControl is AccessControlUpgradeable {
  /**
  * @dev Role identifier for finalizing withdrawals.
  */
  bytes32 public constant FINALIZE_ROLE            = keccak256("FINALIZE_ROLE");
  /**
  * @dev Role identifier for the administrator.
  */
  bytes32 public constant ADMINISTRATOR_ROLE       = keccak256("ADMINISTRATOR_ROLE");
  /**
  * @dev Role identifier for the rewards distributor. This role is assigned to accounts
  * that are allowed to distribute rewards.
  */
  bytes32 public constant REWARDS_DISTRIBUTER_ROLE = keccak256("REWARDS_DISTRIBUTER_ROLE");
}
