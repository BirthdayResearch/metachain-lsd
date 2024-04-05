// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./MarbleLsdAccessControl.sol";

/**
 * @notice @dev
 * This error occurs when deposit of DeFi failed
 */
error DEPOSIT_PAUSED();

/**
 * @notice @dev
 * This error occurs when withdrawal of staked DeFi failed
 */
error WITHDRAWAL_PAUSED();

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is MarbleLsdAccessControl {
  /**
   * @notice Emitted when pause/unpause of deposit happens
   * @param status Status of pause/unpause
   * @param owner Owner address
   */
  event PauseUnpauseDeposit(bool status, address owner);

  /**
   * @notice Emitted when pause/unpause of withdraw happens
   * @param status Status of pause/unpause
   * @param owner Owner address
   */
  event PauseUnpauseWithdrawal(bool status, address owner);

  bool public isDepositPaused = false;
  bool public isWithdrawalPaused = false;

  /**
   * @dev Modifier to make a function callable only when the deposit is not paused.
   */
  modifier whenDepositNotPaused() {
    if (isDepositPaused) revert DEPOSIT_PAUSED();
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the withdraw is not paused.
   */
  modifier whenWithdrawalNotPaused() {
    if (isWithdrawalPaused) revert WITHDRAWAL_PAUSED();
    _;
  }

  /**
   * @dev called by the owner to pause/unpause deposit
   */
  function setDepositPaused(
    bool _paused
  ) external onlyRole(ADMINISTRATOR_ROLE) {
    isDepositPaused = _paused;
    emit PauseUnpauseDeposit(_paused, _msgSender());
  }

  /**
   * @dev called by the owner to pause/unpause withdraw
   */
  function setWithdrawalPaused(
    bool _paused
  ) external onlyRole(ADMINISTRATOR_ROLE) {
    isWithdrawalPaused = _paused;
    emit PauseUnpauseWithdrawal(_paused, _msgSender());
  }
}
