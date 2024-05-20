// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "./MarbleLsdAccessControl.sol";

/**
 * @notice @dev
 * This error occurs when `_fees` is invalid
 */
  error INVALID_FEES();

contract MarbleLsdFees is MarbleLsdAccessControl {
  using Math for uint256;

  /**
  * @dev Basis point scale used for fee calculations, set to 10,000.
  * This is used to represent percentages with two decimal precision (e.g., 1% is represented as 100 basis points).
  */
  uint256 private constant _BASIS_POINT_SCALE = 1e4;

  /**
  * @dev Address where the fees will be sent.
  */
  address public feesRecipientAddress;
  /**
  * @dev Fee applied during the deposit process, represented in basis points.
  */
  uint16 public mintingFees;
  /**
  * @dev Fee applied during the redemption or withdrawal process, represented in basis points.
  */
  uint16 public redemptionFees;
  /**
  * @dev Fee applied during rewards allocation, represented in basis points.
  */
  uint16 public performanceFees;

  /**
   * @notice Emitted when the minting fees is changed
   * @param oldFee The old minting fees
   * @param newFee The new minting fees
   * @param owner Owner address
   */
  event MINTING_FEES_UPDATED(
    uint16 indexed oldFee,
    uint16 indexed newFee,
    address owner
  );

  /**
   * @notice Emitted when the redemption fees is changed
   * @param oldFee The old redemption fees
   * @param newFee The new redemption fees
   * @param owner Owner address
   */
  event REDEMPTION_FEES_UPDATED(
    uint16 indexed oldFee,
    uint16 indexed newFee,
    address owner
  );

  /**
   * @notice Emitted when the performance fees is changed
   * @param oldFee The old performance fees
   * @param newFee The new performance fees
   * @param owner Owner address
   */
  event PERFORMANCE_FEES_UPDATED(
    uint16 indexed oldFee,
    uint16 indexed newFee,
    address owner
  );

  /**
   * @notice Emitted when the fee reciepient wallet address is changed
   * @param oldAddress The old reciepient address
   * @param newAddress The new reciepient address
   * @param owner Owner address
   */
  event FEE_RECIEPIENT_ADDRESS_UPDATED(
    address indexed oldAddress,
    address indexed newAddress,
    address owner
  );

  /**
   * @dev Fees constructor
   */
  function _initializeFees(address _feesRecipientAddress) internal {
    // set initial fees
    mintingFees = 50; // 50 for 0.5%
    redemptionFees = 75; // 75 for 0.75%
    performanceFees = 800; // 800 for 8%
    feesRecipientAddress = _feesRecipientAddress;
  }

  /**
   * @dev Modifier to make a function callable only when the fees are less than _BASIS_POINT_SCALE.
   */
  modifier checkFees(uint16 _fees) {
    // Fee should not exceed 100%
    if (_fees > _BASIS_POINT_SCALE) revert INVALID_FEES();
    _;
  }

  /**
   * @notice Used by addresses with admin roles to set the fees reciepiant address
   * @param _newAddress New fees reciepiant
   */
  function updateFeesRecipientAddress(
    address _newAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    // check zero address
    if (_newAddress == address(0)) revert ZERO_ADDRESS();
    address _oldAddress = feesRecipientAddress;
    // update feesRecipient
    feesRecipientAddress = _newAddress;

    emit FEE_RECIEPIENT_ADDRESS_UPDATED(_oldAddress, _newAddress, _msgSender());
  }

  // === Fee configuration ===

  /**
   * @notice Used by addresses with adminstarator roles to set the new minting fees
   * @param _fees New amount to be set as minting fees
   */
  function updateMintingFees(
    uint16 _fees
  ) external onlyRole(ADMINISTRATOR_ROLE) checkFees(_fees) {
    // check fee invariant & update minting fee
    uint16 _oldFee = mintingFees;
    mintingFees = _fees;
    emit MINTING_FEES_UPDATED(_oldFee, _fees, _msgSender());
  }

  /**
   * @notice Used by addresses with adminstarator roles to set the new minting fees
   * @param _fees New amount to be set as minting fees
   */
  function updateRedemptionFees(
    uint16 _fees
  ) external onlyRole(ADMINISTRATOR_ROLE) checkFees(_fees) {
    // check fee invariant & update redemption or withdrawal fee
    uint16 _oldFee = redemptionFees;
    redemptionFees = _fees;
    emit REDEMPTION_FEES_UPDATED(_oldFee, _fees, _msgSender());
  }

  /**
   * @notice Used by addresses with adminstarator roles to set the new performance fees
   * @param _fees New amount to be set as minting fees
   */
  function updatePerformanceFees(
    uint16 _fees
  ) external onlyRole(ADMINISTRATOR_ROLE) checkFees(_fees) {
    // check fee invariant & update performance fee
    uint16 _oldFee = performanceFees;
    performanceFees = _fees;
    emit PERFORMANCE_FEES_UPDATED(_oldFee, _fees, _msgSender());
  }

  // === Fee operations ===

  /**
   * @notice Calculates the fees that should be added to an amount `assets` that does not already include fees.
   *
   * @dev feeOnRaw is used in mint and withdraw opeartions.
   * This is when we have a value without fees (in the case of mint the amount of share we want to get), and
   * we add the fees on top of that (fees are a percentage of that value).
   */
  function _feeOnRaw(
    uint256 assets,
    uint256 feeBasisPoints
  ) internal pure returns (uint256) {
    return assets.mulDiv(feeBasisPoints, _BASIS_POINT_SCALE, Math.Rounding.Up);
  }

  /**
   * @notice Calculates the fee part of an amount `assets` that already includes fees.
   * @dev feeOnTotal is used in deposit and redeem operations.
   * Calculate the fee amount based on the total assets value (including fees) and the fee rate in basis points,
   * returning the resulting fee value. Used in {deposit} and {redeem} operations
   */
  function _feeOnTotal(
    uint256 assets,
    uint256 feeBasisPoints
  ) internal pure returns (uint256) {
    return
      assets.mulDiv(
      feeBasisPoints,
      feeBasisPoints + _BASIS_POINT_SCALE,
      Math.Rounding.Up
    );
  }
}
