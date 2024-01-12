// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol';

/** @notice @dev
/* This error occurs when transfer of Staked DeFi failed
 */
error WALLET_TRANSFER_FAILED();

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
  using SafeERC20Upgradeable for IERC20Upgradeable;

  IERC20Upgradeable public rewardsToken;
  
  string public constant NAME = 'STAKING_LSD';

  address public walletAddress;

  // Total staked
  uint public totalSupply;
  // User address => staked amount
  mapping(address => uint) public balanceOf;

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
   * @notice To initialize this contract (No constructor as part of the proxy pattery )
   * @param _adminAddress Admin address who will have the DEFAULT_ADMIN_ROLE
   * @param _walletAddress Wallet address who will have the all staked token transferred
   * @param _receiptToken Reward token contract address
   */
  function initialize(
      address _adminAddress,
      address _walletAddress,
      address _receiptToken
  ) external initializer {
      // TODO (Create ERC20 SC here)
      __EIP712_init(NAME, '1');
      _grantRole(DEFAULT_ADMIN_ROLE, _adminAddress);
      walletAddress = _walletAddress;
      rewardsToken = IERC20Upgradeable(_receiptToken);
  }

  function stake() external payable {
    if(msg.value == 0) revert AMOUNT_IS_ZERO();
    balanceOf[msg.sender] += msg.value;
    totalSupply += msg.value;
    // TODO (Uncomment if we want to transfer staked amount to walletAddress directly)
    // (bool sent, ) = walletAddress.call{ value: msg.value }('');
    // if (!sent) revert WALLET_TRANSFER_FAILED();
    // TODO (Allocate xDFI token)
    emit STAKE(msg.sender, msg.value, block.timestamp);
  }

  function withdraw(uint _amount) external {
    if(_amount == 0) revert AMOUNT_IS_ZERO();
    // check if staked amount is less/equal to withdraw amount
    if(_amount > balanceOf[msg.sender]) revert INSUFFICIENT_AMOUNT();
    balanceOf[msg.sender] -= _amount;
    totalSupply -= _amount;
    // Make the external call
    (bool success, ) = msg.sender.call{value: _amount}('');
    require(success, "Withdrawal failed");
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
