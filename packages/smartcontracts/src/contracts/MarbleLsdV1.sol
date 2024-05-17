// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./MarbleLsdAccessControl.sol";
import "./MarbleLsdQueue.sol";
import "./MarbleLsdFees.sol";
import "./ShareToken.sol";
import "./Pausable.sol";

/**
 * @notice @dev
 * This error occurs when transfer of Staked DeFi failed
 */
  error WALLET_TRANSFER_FAILED();

/**
 * @notice @dev
 * This error occurs when withdrawal of Staked DeFi failed
 */
  error WITHDRAWAL_FAILED();

/**
 * @notice @dev
 * This error occurs when `_amount` is zero
 */
  error AMOUNT_IS_ZERO();

/**
 * @notice @dev
 * This error occurs when `_amount` is less than minimum deposit amount
 */
  error LESS_THAN_MIN_DEPOSIT();

/**
 * @notice @dev
 * This error occurs when `_amount` is less than minimum withdrawal amount
 */
  error LESS_THAN_MIN_WITHDRAWAL();

/**
 * @notice @dev
 * This error occurs when withdrawal `assets` is more than contract balance
 */
  error INSUFFICIENT_WITHDRAW_AMOUNT();

/**
 * @notice @dev
 * This error occurs when attempted to deposit more assets than the max amount for `receiver`.
 */
  error ExceededMaxDeposit(address receiver, uint256 assets, uint256 max);

/**
 * @notice @dev
 * Attempted to withdrawal more assets than the max amount for `receiver`.
 */
  error ExceededMaxWithdrawal(address owner, uint256 assets, uint256 max);

/**
 * @notice @dev
 * Attempted to redeem more assets than the max amount for `receiver`.
 */
  error ExceededMaxRedeem(address owner, uint256 shares, uint256 max);

/// @custom:oz-upgrades-unsafe-allow constructor
contract MarbleLsdV1 is
UUPSUpgradeable,
EIP712Upgradeable,
MarbleLsdAccessControl,
Pausable,
MarbleLsdQueue,
MarbleLsdFees
{
  using Math for uint256;

  ShareToken public shareToken;

  string public constant NAME = "MARBLE_LSD";

  address public walletAddress;

  uint256 public totalStakedAssets;
  uint256 public totalRewardAssets;
  uint256 public minDeposit;
  uint256 public minWithdrawal;

  /**
   * @notice Emitted when deposit/mint happen on smart contract
   * @param owner Address initiating the exchange of assets, owned by owner, for shares
   * @param receiver Address receiving shares
   * @param assets Amount of asset that being staked
   * @param shares Amount of shares that being alloted
   * @param fees Amount of asset that being charged as fees for minting
   */
  event Deposit(
    address indexed owner,
    address indexed receiver,
    uint256 assets,
    uint256 shares,
    uint256 fees
  );

  /**
   * @notice Emitted when rewards get distributed
   * @param sender Address initiated rewards
   * @param assets Amount of asset that being rewarded
   * @param fees Amount of asset that being charged as fees for reward distribution
   */
  event Rewards(address indexed sender, uint256 assets, uint256 fees);

  /**
   * @notice Emitted when the wallet address is changed
   * @param oldAddress The old wallet address
   * @param newAddress The new wallet address
   */
  event WALLET_ADDRESS_UPDATED(
    address indexed oldAddress,
    address indexed newAddress
  );

  /**
   * @notice Emitted when the min deposit value is changed
   * @param oldAmount The old min deposit amount
   * @param newAmount The new min deposit amount
   */
  event MIN_DEPOSIT_UPDATED(
    uint256 indexed oldAmount,
    uint256 indexed newAmount
  );

  /**
   * @notice Emitted when the min withdrwal value is changed
   * @param oldAmount The old min withdrwal amount
   * @param newAmount The new min withdrwal amount
   */
  event MIN_WITHDRAWAL_UPDATED(
    uint256 indexed oldAmount,
    uint256 indexed newAmount
  );

  /**
   * @notice Emitted when fund is flushed
   * @param walletAddress Wallet address where funds will get flushed
   * @param amount Amount of assets will get flushed
   */
  event FLUSH_FUND(address indexed walletAddress, uint256 amount);

  /**
   * @dev Constructor to disable initalization of implementation contract
   */
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

  /**
   * @notice To initialize this contract (No constructor as part of the proxy pattern)
   * @param _adminAddress Admin address who will have the DEFAULT_ADMIN_ROLE
   * @param _administratorAddress Adminstrator address who will have the ADMINISTRATOR_ROLE
   * @param _rewardDistributerAddress Reward distributer address who will have the REWARDS_DISTRIBUTER_ROLE
   * @param _finalizerAddress Finalizer address who will have the FINALIZE_ROLE
   * @param _walletAddress Wallet address who will have the all staked asset transferred
   * @param _feesRecipientAddress Fees recipient address who will have the all fees transfered
   */
  function initialize(
    address _adminAddress,
    address _administratorAddress,
    address _rewardDistributerAddress,
    address _finalizerAddress,
    address _walletAddress,
    address _feesRecipientAddress
  ) external initializer {
    // Upgradable contracts initializatoins
    __EIP712_init(NAME, "1");
    __UUPSUpgradeable_init();
    _initializeQueue();
    _initializeFees(_feesRecipientAddress);
    // Roles Grant
    _grantRole(DEFAULT_ADMIN_ROLE, _adminAddress);
    _grantRole(ADMINISTRATOR_ROLE, _administratorAddress);
    _grantRole(REWARDS_DISTRIBUTER_ROLE, _rewardDistributerAddress);
    _grantRole(FINALIZE_ROLE, _finalizerAddress);
    // State Variables init
    walletAddress = _walletAddress;
    minDeposit = 1e18; // 1 DFI
    minWithdrawal = 1e18; // 1 DFI
    shareToken = new ShareToken("DFI STAKING SHARE TOKEN", "mDFI");
  }

  /**
   * @dev To allocate rewards send fund to wallet address
   */
  receive() external payable onlyRole(REWARDS_DISTRIBUTER_ROLE) {
    // check zero amount
    if (msg.value == 0) revert AMOUNT_IS_ZERO();
    // remove fees from amount
    uint256 fees = _feeOnTotal(msg.value, performanceFees);
    uint256 rewards = msg.value - fees;
    // increment reward assets
    totalRewardAssets += rewards;
    emit Rewards(_msgSender(), rewards, fees);

    if (fees > 0 && feesRecipientAddress != address(this)) {
      _sendValue(feesRecipientAddress, fees);
    }
  }

  /**
   * @dev Returns the amount of shares tokens in existence.
   */
  function totalShares() public view virtual returns (uint256) {
    return shareToken.totalSupply();
  }

  /**
   * @dev Returns the amount of all assets, i.e. sum of staked and rewards
   */
  function totalAssets() public view virtual returns (uint256) {
    return totalStakedAssets + totalRewardAssets;
  }

  /**
   * @dev Returns the amount of shares that the contract would exchange for the amount of assets provided, in an ideal
   * scenario where all the conditions are met.
   *
   * - MUST NOT be inclusive of any fees that are charged against assets in the contract.
   * - MUST NOT show any variations depending on the caller.
   * - MUST NOT reflect slippage or other on-chain conditions, when performing the actual exchange.
   * - MUST NOT revert.
   *
   * @notice This calculation MAY NOT reflect the “per-user” price-per-share, and instead should reflect the
   * “average-user’s” price-per-share, meaning what the average user should expect to see when exchanging to and
   * from.
   */
  function convertToShares(
    uint256 _assets
  ) public view virtual returns (uint256) {
    return _convertToShares(_assets, Math.Rounding.Down);
  }

  /**
   * @dev Returns the amount of assets that the contract would exchange for the amount of shares provided, in an ideal
   * scenario where all the conditions are met.
   *
   * - MUST NOT be inclusive of any fees that are charged against assets in the contract.
   * - MUST NOT show any variations depending on the caller.
   * - MUST NOT reflect slippage or other on-chain conditions, when performing the actual exchange.
   * - MUST NOT revert.
   *
   * @notice This calculation MAY NOT reflect the “per-user” price-per-share, and instead should reflect the
   * “average-user’s” price-per-share, meaning what the average user should expect to see when exchanging to and
   * from.
   */
  function convertToAssets(
    uint256 _shares
  ) public view virtual returns (uint256) {
    return _convertToAssets(_shares, Math.Rounding.Down);
  }

  /**
   * @dev Returns the maximum amount of the underlying asset that can be deposited into the contract for the receiver,
   * through a deposit call.
   *
   * - MUST return a limited value if receiver is subject to some deposit limit.
   * - MUST return 2 ** 256 - 1 if there is no limit on the maximum amount of assets that may be deposited.
   * - MUST NOT revert.
   */
  function maxDeposit(address) public view virtual returns (uint256) {
    return type(uint256).max;
  }

  /**
   * @dev Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the
   * contract, through a withdrawal call.
   *
   * - MUST return a limited value if owner is subject to some withdrawal limit or timelock.
   * - MUST NOT revert.
   */
  function maxWithdrawal(address _owner) public view virtual returns (uint256) {
    return _convertToAssets(_shareBalanceOf(_owner), Math.Rounding.Down);
  }

  /**
   * @dev Returns the maximum amount of shares that can be redeemed from the owner balance,
   * through a redeem call.
   *
   * - MUST return a limited value if owner is subject to some withdrawal limit or timelock.
   * - MUST return _shareBalanceOf(owner) if owner is not subject to any withdrawal limit or timelock.
   * - MUST NOT revert.
   */
  function maxRedeem(address _owner) public view virtual returns (uint256) {
    return _shareBalanceOf(_owner);
  }

  /**
   * @dev Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given
   * current on-chain conditions.
   *
   * - MUST return as close to and no more than the exact amount of shares that would be minted in a deposit
   *   call in the same transaction. I.e. deposit should return the same or more shares as previewDeposit if called
   *   in the same transaction.
   * - MUST NOT account for deposit limits like those returned from maxDeposit and should always act as though the
   *   deposit would be accepted.
   * - MUST be inclusive of deposit fees. Integrators should be aware of the existence of deposit fees.
   * - MUST NOT revert.
   *
   * @notice Any unfavorable discrepancy between convertToShares and previewDeposit SHOULD be considered slippage in
   * share price or some other type of condition, meaning the depositor will lose assets by depositing.
   */
  function previewDeposit(
    uint256 _assets
  ) public view virtual returns (uint256) {
    uint256 fees = _feeOnTotal(_assets, mintingFees);
    return _convertToShares(_assets - fees, Math.Rounding.Down);
  }

  /**
   * @dev Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block,
   * given current on-chain conditions.
   *
   * - MUST return as close to and no fewer than the exact amount of shares that would be burned in a withdraw
   *   call in the same transaction. I.e. withdrawal should return the same or fewer shares as previewWithdrawal if
   *   called in the same transaction.
   * - MUST NOT account for withdrawal limits like those returned from maxWithdrawal and should always act as though
   *   the withdrawal would be accepted, regardless if the user has enough shares, etc.
   * - MUST be inclusive of withdrawal fees. Integrators should be aware of the existence of withdrawal fees.
   * - MUST NOT revert.
   *
   * @notice Any unfavorable discrepancy between convertToShares and previewWithdrawal SHOULD be considered slippage in
   * share price or some other type of condition, meaning the depositor will lose assets by depositing.
   */
  function previewWithdrawal(
    uint256 _assets
  ) public view virtual returns (uint256) {
    uint256 fees = _feeOnRaw(_assets, redemptionFees);
    return _convertToShares(_assets + fees, Math.Rounding.Up);
  }

  /**
   * @dev Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block,
   * given current on-chain conditions.
   *
   * - MUST return as close to and no more than the exact amount of assets that would be withdrawn in a redeem call
   *   in the same transaction. I.e. redeem should return the same or more assets as previewRedeem if called in the
   *   same transaction.
   * - MUST NOT account for redemption limits like those returned from maxRedeem and should always act as though the
   *   redemption would be accepted, regardless if the user has enough shares, etc.
   * - MUST be inclusive of withdrawal fees. Integrators should be aware of the existence of withdrawal fees.
   * - MUST NOT revert.
   *
   * @notice Any unfavorable discrepancy between convertToAssets and previewRedeem SHOULD be considered slippage in
   * share price or some other type of condition, meaning the depositor will lose assets by redeeming.
   */
  function previewRedeem(
    uint256 _shares
  ) public view virtual returns (uint256) {
    uint256 assets = _convertToAssets(_shares, Math.Rounding.Down);
    return assets - _feeOnTotal(assets, redemptionFees);
  }

  /**
   * @notice Mints shares to receiver by depositing exact amount of underlying asset.
   */
  function deposit(
    address _receiver
  ) public payable virtual whenDepositNotPaused returns (uint256) {
    // check min deposit invariant
    if (msg.value < minDeposit) revert LESS_THAN_MIN_DEPOSIT();
    // check zero address
    if (_receiver == address(0)) revert ZERO_ADDRESS();
    uint256 maxAssets = maxDeposit(_receiver);
    // check if amount exceeds maxAssets
    if (msg.value > maxAssets)
      revert ExceededMaxDeposit(_receiver, msg.value, maxAssets);
    // calculate shares for corresponding deposit
    uint256 shares = previewDeposit(msg.value);

    _deposit(_msgSender(), _receiver, msg.value, shares);
    return shares;
  }

  /**
   * @dev Initiate withdrawal by adding request in withdrawal queue and returns requestId
   * @param _assets Number of assets to withdrawal
   * @param _receiver Receiver address
   * @return requestId Request id of submitted request to track status
   */
  function requestWithdrawal(
    uint256 _assets,
    address _receiver
  ) public virtual whenWithdrawalNotPaused returns (uint256 requestId) {
    // check min withdrawal
    if (_assets < minWithdrawal) revert LESS_THAN_MIN_WITHDRAWAL();
    // check zero address
    if (_receiver == address(0)) revert ZERO_ADDRESS();

    // check if balance of asset is less/equal to withdrawal amount
    uint256 maxAssets = maxWithdrawal(_msgSender());
    if (_assets > maxAssets)
      revert ExceededMaxWithdrawal(_receiver, _assets, maxAssets);
    // calculate shares to burn for corresponding assets
    uint256 shares = previewWithdrawal(_assets);
    // calculate withdrawal fees
    uint256 fees = _feeOnRaw(_assets, redemptionFees);

    requestId = _requestWithdrawal(
      _msgSender(),
      _receiver,
      _assets,
      shares,
      fees
    );
  }

  /**
   * @dev Initiate withdrawal by adding request in withdrawal queue and returns requestId
   * @param _shares Number of shares to withdrawal
   * @param _receiver Receiver address
   * @return requestId Request id of submitted request to track status
   */
  function requestRedeem(
    uint256 _shares,
    address _receiver
  ) public virtual whenWithdrawalNotPaused returns (uint256 requestId) {
    // check zero amount
    if (_shares == 0) revert AMOUNT_IS_ZERO();
    // check zero address
    if (_receiver == address(0)) revert ZERO_ADDRESS();

    uint256 maxShares = maxRedeem(_msgSender());
    // check if balance of shares token is less/equal to withdrawal amount
    if (_shares > maxShares)
      revert ExceededMaxRedeem(_receiver, _shares, maxShares);

    // calculate assets to return for corresponding shares
    uint256 assets = previewRedeem(_shares);
    // calculate redeem fees
    uint256 fees = _feeOnRaw(assets, redemptionFees);
    // check min withdrawal
    if (assets < minWithdrawal) revert LESS_THAN_MIN_WITHDRAWAL();
    requestId = _requestWithdrawal(
      _msgSender(),
      _receiver,
      assets,
      _shares,
      fees
    );
  }

  /**
   * @dev Function to flush the excess funds to a hardcoded address
   * anyone can call this function
   */
  function flushFunds() external {
    uint256 amountToFlush = getAvailableFundsToFlush();
    // check amountToFlush is zero
    if (amountToFlush == 0) revert AMOUNT_IS_ZERO();
    // send amount out of the contract
    _sendValue(walletAddress, amountToFlush);
    emit FLUSH_FUND(walletAddress, amountToFlush);
  }

  /**
   * @dev Function to calculate the available funds that can be flushed
   * @return The amount of funds available for flushing
   */
  function getAvailableFundsToFlush() public view returns (uint256) {
    uint256 availableBalance = address(this).balance - lockedAssets;
    return availableBalance;
  }

  /**
   * @dev Assets to finalize all the requests should be calculated using `prefinalize()` and sent along
   * @param _lastRequestIdToBeFinalized Finalize requests from last finalized one up to
   */
  function finalize(
    uint256 _lastRequestIdToBeFinalized
  ) external payable onlyRole(FINALIZE_ROLE) {
    // check amount zero
    if (msg.value == 0) revert AMOUNT_IS_ZERO();
    _finalize(_lastRequestIdToBeFinalized, msg.value);
  }

  /**
   * @dev Claim a batch of withdrawal requests if they are finalized sending locked assets to the owner
   * @param _requestIds Array of request ids to claim
   * - Reverts if any request is not finalized or already claimed
   * - Reverts if msg sender is not an owner of the requests
   */
  function claimWithdrawals(uint256[] calldata _requestIds) external {
    for (uint256 i; i < _requestIds.length; ++i) {
      claimWithdrawal(_requestIds[i]);
    }
  }

  /**
   * @dev Claim one`_requestId` request once finalized sending locked assets to the owner
   * @param _requestId Request id to claim
   * - Reverts if any request is not finalized or already claimed
   * - Reverts if msg sender is not an owner of the requests
   */
  function claimWithdrawal(uint256 _requestId) public {
    (
      address receiver,
      uint256 assetsToTransfer,
      uint256 sharesToBurn,
      uint256 feesToTransfer
    ) = _claim(_requestId, _msgSender());
    // send assets to receiver
    _sendValue(receiver, assetsToTransfer);
    // send fees to feesRecipient
    if (feesToTransfer > 0 && feesRecipientAddress != address(this)) {
      _sendValue(feesRecipientAddress, feesToTransfer);
    }
    // update totalStakedAssets
    totalStakedAssets = totalStakedAssets - assetsToTransfer - feesToTransfer;
    emit WithdrawalClaimed(
      _requestId,
      _msgSender(),
      receiver,
      assetsToTransfer,
      sharesToBurn,
      feesToTransfer
    );
    // Burn shares after token transfer to maintain peg
    shareToken.burn(address(this), sharesToBurn);
  }

  /**
   * @notice Used by addresses with Admin and Operational roles to set the new flush receive address
   * @param _newAddress New address to be flushed to
   */
  function updateWalletAddress(
    address _newAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    // check zero address
    if (_newAddress == address(0)) revert ZERO_ADDRESS();
    address _oldAddress = walletAddress;
    // update
    walletAddress = _newAddress;

    emit WALLET_ADDRESS_UPDATED(_oldAddress, _newAddress);
  }

  /**
   * @notice Used by addresses with Admin and Operational roles to set the new min deposit amount
   * @param _amount New amount to be set as min deposit
   */
  function updateMinDeposit(
    uint256 _amount
  ) external onlyRole(ADMINISTRATOR_ROLE) {
    // check zero amount
    if (_amount == 0) revert AMOUNT_IS_ZERO();
    uint256 _oldDeposit = minDeposit;
    // update
    minDeposit = _amount;

    emit MIN_DEPOSIT_UPDATED(_oldDeposit, _amount);
  }

  /**
   * @notice Used by addresses with Admin and Operational roles to set the new min Withdrawal amount
   * @param _amount New amount to be set as min deposit
   */
  function updateMinWithdrawal(
    uint256 _amount
  ) external onlyRole(ADMINISTRATOR_ROLE) {
    // check zero amount
    if (_amount == 0) revert AMOUNT_IS_ZERO();
    uint256 _oldWithdrawal = minWithdrawal;
    // update
    minWithdrawal = _amount;

    emit MIN_WITHDRAWAL_UPDATED(_oldWithdrawal, _amount);
  }

  /**
   * @dev Gets the current version of the contract
   */
  function version() external view returns (string memory) {
    return StringsUpgradeable.toString(_getInitializedVersion());
  }

  /**
   * @dev Internal balance function, returns the amount of tokens owned by `account`.
   */
  function _shareBalanceOf(
    address _account
  ) internal view virtual returns (uint256) {
    // mDFI balance
    return shareToken.balanceOf(_account);
  }

  /**
   * @dev Internal conversion function (from assets to shares) with support for rounding direction.
   */
  function _convertToShares(
    uint256 _assets,
    Math.Rounding _rounding
  ) internal view virtual returns (uint256) {
    uint256 supply = totalShares(); // Saves an extra SLOAD if totalShares is non-zero.
    return
      supply == 0 ? _assets : _assets.mulDiv(supply, totalAssets(), _rounding);
  }

  /**
   * @dev Internal conversion function (from shares to assets) with support for rounding direction.
   */
  function _convertToAssets(
    uint256 _shares,
    Math.Rounding _rounding
  ) internal view virtual returns (uint256) {
    uint256 supply = totalShares(); // Saves an extra SLOAD if totalShares is non-zero.
    return
      supply == 0 ? _shares : _shares.mulDiv(totalAssets(), supply, _rounding);
  }

  /**
   * @dev Internal deposit function with common workflow.
   */
  function _deposit(
    address _owner,
    address _receiver,
    uint256 _assets,
    uint256 _shares
  ) internal virtual {
    uint256 fees = _feeOnTotal(_assets, mintingFees);
    uint256 assetsToBeStaked = _assets - fees;
    // update staked asset
    totalStakedAssets += assetsToBeStaked;
    // mint shares token for receiver
    shareToken.mint(_receiver, _shares);

    emit Deposit(_owner, _receiver, assetsToBeStaked, _shares, fees);
    // send fees to feesRecipient
    if (fees > 0 && feesRecipientAddress != address(this)) {
      _sendValue(feesRecipientAddress, fees);
    }
  }

  /**
   * @dev Internal withdrawal function with common workflow.
   */
  function _requestWithdrawal(
    address _owner,
    address _receiver,
    uint256 _assets,
    uint256 _shares,
    uint256 _fees
  ) internal returns (uint256 requestId) {
    // Transfer shares
    shareToken.transferFrom(_owner, address(this), _shares);
    // Create entry in queue for withdrawal request
    requestId = _enqueue(_owner, _receiver, _assets, _shares, _fees);
  }
}
