// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol';
import './ReceiptToken.sol';

/** @notice @dev
/* This error occurs when transfer of Staked DeFi failed
 */
error WALLET_TRANSFER_FAILED();

/** @notice @dev
/* This error occurs when withdrawal of Staked DeFi failed
 */
error WITHDRAWAL_FAILED();

/** @notice @dev
/* This error occurs when `_amount` is zero
*/
error AMOUNT_IS_ZERO();

/** @notice @dev
/* This error occurs when `_amount` is more than staked
*/
error INSUFFICIENT_AMOUNT();

/** @notice @dev
/* This error occurs when using Zero address
*/
error ZERO_ADDRESS();

contract StakingLsdV1 is UUPSUpgradeable, EIP712Upgradeable, AccessControlUpgradeable {
  ReceiptToken public receiptToken;
  
  string public constant NAME = 'STAKING_LSD';

  address public walletAddress;

  // Total staked
  uint public totalSupply;

  /**
   * @notice Emitted when staking happen on smart contract
   * @param from Address initiating stake
   * @param amount Amount of the token that being staked
   * @param stakedAt Staking time
   */
  event STAKE(
    address indexed from,
    uint indexed amount,
    uint indexed stakedAt
  );

  /**
   * @notice Emitted when withdraw happen on smart contract
   * @param from Address initiating withdraw
   * @param amount Amount of the token that being withdraw
   * @param withdrawAt Withdraw time
   */
  event WITHDRAW(
    address indexed from,
    uint indexed amount,
    uint indexed withdrawAt
  );

  /**
   * @notice Emitted when the address to be wallet address is changed
   * @param oldAddress The old address to be wallet address
   * @param newAddress The new address to be wallet address
   */
  event WALLET_ADDRESS_CHANGED(address indexed oldAddress, address indexed newAddress);

  /**
   * constructor to disable initalization of implementation contract
   */
  constructor() {
    _disableInitializers();
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

  /**
   * @notice To initialize this contract (No constructor as part of the proxy pattery)
   * @param _adminAddress Admin address who will have the DEFAULT_ADMIN_ROLE
   * @param _walletAddress Wallet address who will have the all staked token transferred
   * @param _receiptTokenName Receipt token name
   * @param _receiptTokenSymbol Receipt token symbol
   */
  function initialize(
    address _adminAddress,
    address _walletAddress,
    string memory _receiptTokenName,
    string memory _receiptTokenSymbol
  ) external initializer {
    __EIP712_init(NAME, '1');
    _grantRole(DEFAULT_ADMIN_ROLE, _adminAddress);
    walletAddress = _walletAddress;
    receiptToken = new ReceiptToken(_receiptTokenName, _receiptTokenSymbol);
  }

  function stake() external payable {
    if (msg.value == 0) revert AMOUNT_IS_ZERO();
    totalSupply += msg.value;
    // TODO (Uncomment if we want to transfer staked amount to walletAddress directly)
    // (bool sent, ) = walletAddress.call{ value: msg.value }('');
    // if (!sent) revert WALLET_TRANSFER_FAILED();
    ReceiptToken(receiptToken).mint(msg.sender, msg.value);
    emit STAKE(msg.sender, msg.value, block.timestamp);
  }

  function withdraw(uint _amount) external {
    if (_amount == 0) revert AMOUNT_IS_ZERO();
    // check if balance of receipt token is less/equal to withdraw amount
    if (_amount > ReceiptToken(receiptToken).balanceOf(msg.sender)) revert INSUFFICIENT_AMOUNT();
    ReceiptToken(receiptToken).burn(msg.sender, _amount);
    totalSupply -= _amount;
    // transfer amount to the sneder address
    (bool sent, ) = msg.sender.call{ value: _amount }('');
    if (!sent) revert WITHDRAWAL_FAILED();
    emit WITHDRAW(msg.sender, _amount, block.timestamp);
  }

  /**
   * @notice Used by addresses with Admin and Operational roles to set the new flush receive address
   * @param _newAddress new address to be flushed to
   */
  function changeWalletAddress(address _newAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
    if (_newAddress == address(0)) revert ZERO_ADDRESS();
    address _oldAddress = walletAddress;
    walletAddress = _newAddress;
    emit WALLET_ADDRESS_CHANGED(_oldAddress, _newAddress);
  }

  /**
   * @notice To get the current version of the contract
   */
  function version() external view returns (string memory) {
    return StringsUpgradeable.toString(_getInitializedVersion());
  }
}
