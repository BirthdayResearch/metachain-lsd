// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

/** @notice @dev
 * This error occurs when depoisit of DeFi failed
 */
error DEPOSIT_PAUSED();

/** @notice @dev
 * This error occurs when withdrawal of staked DeFi failed
 */
error WITHDRAWAL_PAUSED();

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is AccessControlUpgradeable {

  /**
   * @notice Emitted when pause/unpause of depoisit happens
   * @param status Status of pause/unpause
   * @param owner Owner address
   */
  event PauseUnpauseDeposit(
    bool status,
    address owner
  );

  /**
   * @notice Emitted when pause/unpause of withdraw happens
   * @param status Status of pause/unpause
   * @param owner Owner address
   */
  event PauseUnpauseWithdraw(
    bool status,
    address owner
  );

  bool public isDepositPaused = false;
  bool public isWithdrawPaused = false;

  /**
   * @dev Modifier to make a function callable only when the depoisit is not paused.  
   */
  modifier whenDepoisitNotPaused() {
    if (isDepositPaused) revert DEPOSIT_PAUSED();
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the withdraw is not paused.  
   */
  modifier whenWithdrawNotPaused() {
    if(isWithdrawPaused) revert WITHDRAWAL_PAUSED();
    _;
  }

  /**
   * @dev called by the owner to pause/unpause deposit
   */
  function setDepositPaused(bool _paused) external onlyRole(DEFAULT_ADMIN_ROLE){
    isDepositPaused = _paused;
    emit PauseUnpauseDeposit(_paused, _msgSender());
  }

  /**
   * @dev called by the owner to pause/unpause withdraw
   */
  function setWithdrawPaused(bool _paused) external onlyRole(DEFAULT_ADMIN_ROLE) {
    isWithdrawPaused = _paused;
    emit PauseUnpauseWithdraw(_paused, _msgSender());
  }
}