
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import './ShareToken.sol';
import './Pausable.sol';

/** @notice @dev
 * This error occurs when transfer of Staked DeFi failed
 */
error WALLET_TRANSFER_FAILED();

/** @notice @dev
 * This error occurs when withdrawal of Staked DeFi failed
 */
error WITHDRAWAL_FAILED();

/** @notice @dev
 * This error occurs when `_amount` is zero
 */
error AMOUNT_IS_ZERO();

/** @notice @dev
 * This error occurs when withdraw `assets` is more than contract balance
 */
error INSUFFICIENT_WITHDRAW_AMOUNT();

/** @notice @dev
 * This error occurs when using Zero address
 */
error ZERO_ADDRESS();

/** @notice @dev
 * This error occurs when attempted to deposit more assets than the max amount for `receiver`.
 */
error ExceededMaxDeposit(address receiver, uint256 assets, uint256 max);

/** @notice @dev
 *  Attempted to withdraw more assets than the max amount for `receiver`.
 */
error ExceededMaxWithdraw(address owner, uint256 assets, uint256 max);

/** @notice @dev
 *  Attempted to redeem more assets than the max amount for `receiver`.
 */
error ExceededMaxRedeem(address owner, uint256 shares, uint256 max);

contract MarbleLsdV1 is UUPSUpgradeable, EIP712Upgradeable, AccessControlUpgradeable, Pausable {
  using Math for uint256;

  ShareToken public shareToken;
  
  string public constant NAME ='MARBLE_LSD';

  address public walletAddress;

  // TODO update Total staked while transferring assets for creating MN
  uint256 public totalStakedAssets;

  /**
   * @notice Emitted when deposit/mint happen on smart contract
   * @param sender Address initiating deposit/mint
   * @param owner Address reciving shares
   * @param assets Amount of asset that being staked
   * @param shares Amount of shares that being alloted
   */
  event Deposit(
    address indexed sender,
    address indexed owner,
    uint256 assets,
    uint256 shares
  );

  /**
   * @notice Emitted when withdraw/redeem happen on smart contract
   * @param sender Address initiating withdraw
   * @param receiver Address reciving assets
   * @param assets Amount of asset that being withdraw
   * @param shares Amount of shares that being burned
   */
  event Withdraw(
    address indexed sender,
    address indexed receiver,
    uint256 assets,
    uint256 shares
  );

  /**
   * @notice Emitted when rewards get distributed
   * @param sender Address initiated rewards
   * @param assets Amount of asset that being withdraw
   */
  event Rewards(
    address indexed sender,
    uint256 assets
  );

  /**
   * @notice Emitted when the address to be wallet address is changed
   * @param oldAddress The old address to be wallet address
   * @param newAddress The new address to be wallet address
   */
  event WALLET_ADDRESS_CHANGED(
    address indexed oldAddress,
    address indexed newAddress
  );

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
   * @param _shareTokenName Share token name
   * @param _shareTokenSymbol Share token symbol
   */
  function initialize(
    address _adminAddress,
    address _walletAddress,
    string memory _shareTokenName,
    string memory _shareTokenSymbol
  ) external initializer {
    __EIP712_init(NAME, '1');
    _grantRole(DEFAULT_ADMIN_ROLE, _adminAddress);
    walletAddress = _walletAddress;
    shareToken = new ShareToken(_shareTokenName, _shareTokenSymbol);
  }

  /**
   * @dev To allocate rewards send fund to wallet address
   */
  receive() external payable {
    emit Rewards(_msgSender(), msg.value);
  }

  /**
   * @dev Returns the name of the shares token.
   */
  function name() public view virtual returns (string memory) {
    return shareToken.name();
  }

  /**
   * @dev Returns the symbol of the shares token, usually a shorter version of the
   * name.
   */
  function symbol() public view virtual returns (string memory) {
    return shareToken.name();
  }

  /**
   * @dev Returns the decimals of the shares token
   * name.
   */
  function decimals() public view virtual returns (uint8) {
    return shareToken.decimals();
  }

  /**
   * @dev Returns the amount of shares tokens in existence.
   */
  function totalSupply() public view virtual returns (uint256) {
    return shareToken.totalSupply();
  }

  /**
   * @dev Returns the amount of tokens owned by `account`.
   */
  function balanceOf(address _account) public view virtual returns (uint256) {
    return shareToken.balanceOf(_account);
  }

  /**
   * @dev Returns the amount of all assets, i.e. sum of staked, rewards, and balance
   */
  function totalAssets() public view virtual returns (uint256) {
    return totalStakedAssets + address(this).balance;
  }

  /**
   * @dev Returns the amount of shares that the Vault would exchange for the amount of assets provided, in an ideal
   * scenario where all the conditions are met.
   *
   * - MUST NOT be inclusive of any fees that are charged against assets in the Vault.
   * - MUST NOT show any variations depending on the caller.
   * - MUST NOT reflect slippage or other on-chain conditions, when performing the actual exchange.
   * - MUST NOT revert.
   *
   * @notice This calculation MAY NOT reflect the “per-user” price-per-share, and instead should reflect the
   * “average-user’s” price-per-share, meaning what the average user should expect to see when exchanging to and
   * from.
   */
  function convertToShares(uint256 _assets) public view virtual returns (uint256) {
    return _convertToShares(_assets, Math.Rounding.Down);
  }

  /**
   * @dev Returns the amount of assets that the Vault would exchange for the amount of shares provided, in an ideal
   * scenario where all the conditions are met.
   *
   * - MUST NOT be inclusive of any fees that are charged against assets in the Vault.
   * - MUST NOT show any variations depending on the caller.
   * - MUST NOT reflect slippage or other on-chain conditions, when performing the actual exchange.
   * - MUST NOT revert.
   *
   * @notice This calculation MAY NOT reflect the “per-user” price-per-share, and instead should reflect the
   * “average-user’s” price-per-share, meaning what the average user should expect to see when exchanging to and
   * from.
   */
  function convertToAssets(uint256 _shares) public view virtual returns (uint256) {
    return _convertToAssets(_shares, Math.Rounding.Down);
  }

  /**
   * @dev Returns the maximum amount of the underlying asset that can be deposited into the Vault for the receiver,
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
   * Vault, through a withdraw call.
   *
   * - MUST return a limited value if owner is subject to some withdrawal limit or timelock.
   * - MUST NOT revert.
   */
  function maxWithdraw(address _owner) public view virtual returns (uint256) {
    return _convertToAssets(balanceOf(_owner), Math.Rounding.Down);
  }
  
  /**
   * @dev Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given
   * current on-chain conditions.
   *
   * - MUST return as close to and no more than the exact amount of Vault shares that would be minted in a deposit
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
  function previewDeposit(uint256 _assets) public view virtual returns (uint256) {
    return _convertToShares(_assets, Math.Rounding.Down);
  }

  /**
   * @dev Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block,
   * given current on-chain conditions.
   *
   * - MUST return as close to and no fewer than the exact amount of Vault shares that would be burned in a withdraw
   *   call in the same transaction. I.e. withdraw should return the same or fewer shares as previewWithdraw if
   *   called
   *   in the same transaction.
   * - MUST NOT account for withdrawal limits like those returned from maxWithdraw and should always act as though
   *   the withdrawal would be accepted, regardless if the user has enough shares, etc.
   * - MUST be inclusive of withdrawal fees. Integrators should be aware of the existence of withdrawal fees.
   * - MUST NOT revert.
   *
   * @notice Any unfavorable discrepancy between convertToShares and previewWithdraw SHOULD be considered slippage in
   * share price or some other type of condition, meaning the depositor will lose assets by depositing.
   */
  function previewWithdraw(uint256 _assets) public view virtual returns (uint256) {
    return _convertToShares(_assets, Math.Rounding.Up);
  }

  /**
   * @dev Returns the maximum amount of shares that can be redeemed from the owner balance,
   * through a redeem call.
   *
   * - MUST return a limited value if owner is subject to some withdrawal limit or timelock.
   * - MUST return balanceOf(owner) if owner is not subject to any withdrawal limit or timelock.
   * - MUST NOT revert.
   */
  function maxRedeem(address _owner) public view virtual returns (uint256) {
    return balanceOf(_owner);
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
   * @notice any unfavorable discrepancy between convertToAssets and previewRedeem SHOULD be considered slippage in
   * share price or some other type of condition, meaning the depositor will lose assets by redeeming.
   */
  function previewRedeem(uint256 _shares) public view virtual returns (uint256) {
    return _convertToAssets(_shares, Math.Rounding.Down);
  }

  /**
   * @dev Mints shares Vault shares to receiver by depositing exactly amount of underlying tokens.
   * 
   * - MUST emit the Deposit event.
   */
  function deposit(address _receiver) payable public virtual whenDepoisitNotPaused returns (uint256) {
    // check zero amount
    if (msg.value == 0) revert AMOUNT_IS_ZERO();
    // check zero address
    if (_receiver == address(0)) revert ZERO_ADDRESS();
    uint256 maxAssets = maxDeposit(_receiver);

    if (msg.value > maxAssets) {
      revert ExceededMaxDeposit(_receiver, msg.value, maxAssets);
    }
    uint256 shares = previewDeposit(msg.value);

    _deposit(_msgSender(), _receiver, msg.value, shares);
    return shares;
  }

  /**
   * @dev Burns shares from owner and sends exactly assets to receiver.
   *
   * - MUST emit the Withdraw event.
   * - MUST revert if all of assets cannot be withdrawn (due to withdrawal limit being reached, slippage, the owner
   *   not having enough shares, etc).
   */
  function withdraw(uint256 _assets, address _receiver) public virtual whenWithdrawNotPaused returns (uint256) {
    // check zero amount
    if (_assets == 0) revert AMOUNT_IS_ZERO();
    // check zero address
    if (_receiver == address(0)) revert ZERO_ADDRESS();

    // check if balance of asset is less/equal to withdraw amount
    uint256 maxAssets = maxWithdraw(_msgSender());
    if (_assets > maxAssets) revert ExceededMaxWithdraw(_receiver, _assets, maxAssets);
    
    uint256 shares = previewWithdraw(_assets);
    _withdraw(_msgSender(), _receiver, _assets, shares);

    return shares;
  }

  /**
   * @dev Burns exactly shares from owner and sends assets of underlying tokens to receiver.
   *
   * - MUST emit the Withdraw event.
   * - MUST revert if all of shares cannot be redeemed (due to withdrawal limit being reached, slippage, the owner
   *   not having enough shares, etc).
   */
  function redeem(uint256 _shares, address _receiver) public virtual whenWithdrawNotPaused returns (uint256) {
    // check zero amount
    if (_shares == 0) revert AMOUNT_IS_ZERO();
    // check zero address
    if (_receiver == address(0)) revert ZERO_ADDRESS();

    uint256 maxShares = maxRedeem(_msgSender());
    // check if balance of shares token is less/equal to withdraw amount
    if (_shares > maxShares) revert ExceededMaxRedeem(_msgSender(), _shares, maxShares);

    uint256 assets = previewRedeem(_shares);
    _withdraw(_msgSender(), _receiver, assets, _shares);

    return assets;
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
   * @notice Gets the current version of the contract
   */
  function version() external view returns (string memory) {
    return StringsUpgradeable.toString(_getInitializedVersion());
  }

  /**
   * @dev Internal conversion function (from assets to shares) with support for rounding direction.
   */
  function _convertToShares(uint256 _assets, Math.Rounding _rounding) internal view virtual returns (uint256) {
    uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.
    return supply == 0 ? _assets : _assets.mulDiv(supply, totalAssets(), _rounding);
  }

  /**
   * @dev Internal conversion function (from shares to assets) with support for rounding direction.
   */
  function _convertToAssets(uint256 _shares, Math.Rounding _rounding) internal view virtual returns (uint256) {
    uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.
    return supply == 0 ? _shares : _shares.mulDiv(totalAssets(), supply, _rounding);
  }

  /**
   * @dev Internal deposit function with common workflow.
   */
  function _deposit(address _caller, address _receiver, uint256 _assets, uint256 _shares) internal virtual {
    if (msg.value == 0) revert AMOUNT_IS_ZERO();
    // mint shares token for receiver
    shareToken.mint(_receiver, _shares);

    emit Deposit(_caller, _receiver, _assets, _shares);
  }

  /**
   * @dev Internal withdraw function with common workflow.
   */
  function _withdraw(
      address _caller,
      address _receiver,
      uint256 _assets,
      uint256 _shares
  ) internal virtual {
    // check if contract have enoufgh fund to transfer
    if (_assets > address(this).balance) revert INSUFFICIENT_WITHDRAW_AMOUNT();
    // we need to do the transfer before the burn so that any reentrancy would happen before the
    // shares are burned and after the _assets are transferred, which is a valid state.
    (bool sent, ) = _msgSender().call{ value: _assets }('');
    if (!sent) revert WITHDRAWAL_FAILED();
    // burn shares token
    shareToken.burn(_msgSender(), _shares);

    emit Withdraw(_caller, _receiver, _assets, _shares);
  }
}
