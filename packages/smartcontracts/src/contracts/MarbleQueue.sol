// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';


/** @notice
 * This error occurs when `_requestId` is invalid or zero
 */
error InvalidRequestId(uint256 _requestId);

/** @notice
 * This error occurs when provided empty batch
 */
error EmptyBatches();

/** @notice
 * This error occurs when provided batch array is not sorted
 */
error BatchesAreNotSorted();

/** @notice
 * This error occurs when provided too much assets to finalize
 */
error InvalidAssetsToFinalize(uint256 sent, uint256 maxExpected);

/** @notice
 * This error occurs when requested fund is not finalized
 */
error RequestNotFoundOrNotFinalized(uint256 _requestId);

/** @notice
 * This error occurs when request is already claimed
 */
error RequestAlreadyClaimed(uint256 _requestId);

error NotEnoughEther();
error CantSendValueRecipientMayHaveReverted();
error NotOwner(address _sender, address _owner);

contract MarbleQueue {
  using EnumerableSet for EnumerableSet.UintSet;

  /** @dev
   *  queue for withdrawal requests, indexes (requestId) start from 1
   */
  bytes32 internal constant QUEUE_POSITION = keccak256("WithdrawalQueue.queue");

  /** @dev
   *  withdrawal requests mapped to the owners
   */
  bytes32 internal constant REQUEST_BY_OWNER_POSITION = keccak256("WithdrawalQueue.requestsByOwner");

  /** @dev
   *  last index in request queue
   */
  uint256 public lastRequestId;
  /** @dev
   *  last index of finalized request in the queue
   */
  uint256 public lastFinalizedRequestId;
  /** @dev
   *  last index of finalized request in the queue
   */
  uint256 public lockedAssets;

 /**
   * @notice Emitted when withdrawal requested happen on smart contract
   * @param requestId withdraw requestId
   * @param owner Owner address
   * @param receiver Reciving assets
   * @param assets Amount of asset that being staked
   * @param shares Amount of shares that being alloted
   */
  event WithdrawalRequested(
      uint256 indexed requestId,
      address indexed owner,
      address indexed receiver,
      uint256 assets,
      uint256 shares
  );

  /** @notice Emitted when withdrawal requested is finalized
   *  @param from request id from where finalisation started
   *  @param to request id from where finalisation ended
   *  @param amountOfAssetsLocked amount of assets gets locked
   *  @param sharesToBurn amount of shares gets burned
   *  @param timestamp block time when finalisation occured
   */
  event WithdrawalsFinalized(
    uint256 indexed from,
    uint256 indexed to,
    uint256 amountOfAssetsLocked,
    uint256 sharesToBurn,
    uint256 timestamp
  );

  /** @notice Emitted when withdrawal is claimed
   *  @param requestId request id for which claimed
   *  @param owner reciving assets
   *  @param receiver amount of assets gets locked
   *  @param amountOfAssets Assets to transfer
   *  @param sharesToBurn shares buned
   */

  event WithdrawalClaimed(
    uint256 indexed requestId,
    address indexed owner,
    address indexed receiver,
    uint256 amountOfAssets,
    uint256 sharesToBurn
  );

  /** @notice
   *  structure representing a request for withdrawal
   */
  struct WithdrawalRequest {
    /// @notice sum of the all assets submitted for withdrawals including this request
    uint256 cumulativeAssets;
    /// @notice sum of the all shares locked for withdrawal including this request
    uint256 cumulativeShares;
    /// @notice address that can claim
    address owner;
    /// @notice address that can claim or transfer the request
    address receiver;
    /// @notice block.timestamp when the request was created
    uint40 timestamp;
    /// @notice flag if the request was claimed
    bool claimed;
  }

  /** @notice
   *  output format struct for `_getWithdrawalStatus()` method
   */
  struct WithdrawalRequestStatus {
    /// @notice stETH token amount that was locked on withdrawal queue for this request
    uint256 amountOfStETH;
    /// @notice amount of stETH shares locked on withdrawal queue for this request
    uint256 amountOfShares;
    /// @notice address that can claim or transfer this request
    address receiver;
    /// @notice timestamp of when the request was created, in seconds
    uint256 timestamp;
    /// @notice true, if request is finalized
    bool isFinalized;
    /// @notice true, if request is claimed. Request is claimable if (isFinalized && !isClaimed)
    bool isClaimed;
  }

  /** @notice
   *  Queue constructor
   */
  function _initializeQueue() internal {
    // setting dummy zero structs in checkpoints and queue beginning
    // to avoid uint underflows and related if-branches
    // 0-index is reserved as 'not_found' response in the interface everywhere
    _getQueue()[0] = WithdrawalRequest(0, 0, address(0), address(0), uint40(block.timestamp), true);
  }

  /** @notice
   *  Returns status for requests with provided ids
   *  @param _requestIds array of withdrawal request ids
   */
  function getWithdrawalStatus(uint256[] calldata _requestIds) external view returns (WithdrawalRequestStatus[] memory statuses) {
    statuses = new WithdrawalRequestStatus[](_requestIds.length);
    for (uint256 i = 0; i < _requestIds.length; ++i) {
      statuses[i] = _getStatus(_requestIds[i]);
    }
  }

  /** @notice
   *  Checks finalization batches, calculates required Assets and amount of shares to burn
   *  @param _batches sorted array of request Ids for finalization batches
   */
  function prefinalize(uint256[] calldata _batches) external view returns (uint256 assetsToLock, uint256 sharesToBurn) {
    if (_batches.length == 0) revert EmptyBatches();

    if (_batches[0] <= lastFinalizedRequestId) revert InvalidRequestId(_batches[0]);
    if (_batches[_batches.length - 1] > lastRequestId) revert InvalidRequestId(_batches[_batches.length - 1]);

    uint256 currentBatchIndex;
    uint256 prevBatchEndRequestId = lastFinalizedRequestId;
    WithdrawalRequest memory prevBatchEnd = _getQueue()[prevBatchEndRequestId];
    while (currentBatchIndex < _batches.length) {
      uint256 batchEndRequestId = _batches[currentBatchIndex];
      if (batchEndRequestId <= prevBatchEndRequestId) revert BatchesAreNotSorted();

      WithdrawalRequest memory batchEnd = _getQueue()[batchEndRequestId];

      uint256 assetsDiff = batchEnd.cumulativeAssets - prevBatchEnd.cumulativeAssets;
      uint256 sharesDiff = batchEnd.cumulativeShares - prevBatchEnd.cumulativeShares;
      // add assets and shares
      assetsToLock += assetsDiff;
      sharesToBurn += sharesDiff;
      // increment
      prevBatchEndRequestId = batchEndRequestId;
      prevBatchEnd = batchEnd;
      unchecked{ ++currentBatchIndex; }
    }
  }

  /**
   * @notice return the number of unfinalized requests in the queue
   */
  function unfinalizedRequestNumber() external view returns (uint256) {
    return lastRequestId - lastFinalizedRequestId;
  }

  /**
   * @notice Returns the amount of stETH in the queue yet to be finalized
   */
  function unfinalizedAssets() external view returns (uint256) {
    return _getQueue()[lastRequestId].cumulativeAssets - _getQueue()[lastFinalizedRequestId].cumulativeAssets;
  }

  /**
   * @dev Finalize requests in the queue
   * MUST emit the WithdrawalsFinalized event.
   * @param _lastRequestIdToBeFinalized finalize requests from last finalized one up to
   */
  function _finalize(uint256 _lastRequestIdToBeFinalized, uint256 _amountOfAssets) internal {
    if (_lastRequestIdToBeFinalized > lastRequestId) revert InvalidRequestId(_lastRequestIdToBeFinalized);
    if (_lastRequestIdToBeFinalized <= lastFinalizedRequestId) revert InvalidRequestId(_lastRequestIdToBeFinalized);

    WithdrawalRequest memory lastFinalizedRequest = _getQueue()[lastFinalizedRequestId];
    WithdrawalRequest memory requestToFinalize = _getQueue()[_lastRequestIdToBeFinalized];

    uint256 assetsToFinalize = requestToFinalize.cumulativeAssets - lastFinalizedRequest.cumulativeAssets;
    if (_amountOfAssets != assetsToFinalize) revert InvalidAssetsToFinalize(_amountOfAssets, assetsToFinalize);

    uint256 firstRequestIdToFinalize = lastFinalizedRequestId + 1;
    // update Locked assets
    lockedAssets += _amountOfAssets;
    lastFinalizedRequestId = _lastRequestIdToBeFinalized;

    emit WithdrawalsFinalized(
        firstRequestIdToFinalize,
        _lastRequestIdToBeFinalized,
        _amountOfAssets,
        requestToFinalize.cumulativeShares - lastFinalizedRequest.cumulativeShares,
        block.timestamp
    );
  }

  /**
   * @dev Claim the request and transfer locked ether to `_recipient`.
   * MUST emit the WithdrawalClaimed event.
   * @param _requestId id of the request to claim
   */
  function _claim(uint256 _requestId, address _owner) internal returns (uint256 assetsToTransfer, uint256 sharesToBurn) {
    if (_requestId == 0) revert InvalidRequestId(_requestId);
    if (_requestId > lastFinalizedRequestId) revert RequestNotFoundOrNotFinalized(_requestId);

    WithdrawalRequest storage request = _getQueue()[_requestId];

    if (request.claimed) revert RequestAlreadyClaimed(_requestId);
    if (request.owner != _owner) revert NotOwner(_owner, request.owner);

    request.claimed = true;
    assert(_getRequestsByOwner()[request.owner].remove(_requestId));
    WithdrawalRequest memory prevRequest = _getQueue()[_requestId - 1];
    assetsToTransfer = request.cumulativeAssets - prevRequest.cumulativeAssets;
    sharesToBurn = request.cumulativeShares - prevRequest.cumulativeShares;
    lockedAssets -= assetsToTransfer;
    _sendValue(request.receiver, assetsToTransfer);
    emit WithdrawalClaimed(_requestId, _owner, request.receiver, assetsToTransfer, sharesToBurn);
  }


  function _sendValue(address _recipient, uint256 _amount) internal {
    if (address(this).balance < _amount) revert NotEnoughEther();
    (bool success,) = _recipient.call{ value: _amount }("");
    if (!success) revert CantSendValueRecipientMayHaveReverted();
  }


  /** @dev
   *  creates a new `WithdrawalRequest` in the queue
   */
  function _enqueue(
    address _owner,
    address _receiver,
    uint256 _assets,
    uint256 _shares
  ) internal returns (uint256 requestId) {
    WithdrawalRequest memory lastRequest = _getQueue()[lastRequestId];

    uint256 cumulativeAssets = lastRequest.cumulativeAssets + _assets;
    uint256 cumulativeShares = lastRequest.cumulativeShares + _shares;

    requestId = lastRequestId + 1;
    WithdrawalRequest memory newRequest =  WithdrawalRequest(
        cumulativeAssets,
        cumulativeShares,
        _owner,
        _receiver,
        uint40(block.timestamp),
        false
    );
    _getQueue()[requestId] = newRequest;
    assert(_getRequestsByOwner()[_owner].add(requestId));
    // update last request Id
    lastRequestId = requestId;
    emit WithdrawalRequested(requestId, _owner, _receiver, _assets, _shares);
  }

  /** @dev
   *  Returns the status of the withdrawal request with `_requestId` id
   */
  function _getStatus(uint256 _requestId) internal view returns (WithdrawalRequestStatus memory status) {
    if (_requestId == 0 || _requestId > lastRequestId) revert InvalidRequestId(_requestId);

    WithdrawalRequest memory request = _getQueue()[_requestId];
    WithdrawalRequest memory previousRequest = _getQueue()[_requestId - 1];

    status = WithdrawalRequestStatus(
      request.cumulativeAssets - previousRequest.cumulativeAssets,
      request.cumulativeShares - previousRequest.cumulativeShares,
      request.receiver,
      request.timestamp,
      _requestId <= lastFinalizedRequestId,
      request.claimed
    );
  }

  function _getQueue() internal pure returns (mapping(uint256 => WithdrawalRequest) storage queue) {
    bytes32 position = QUEUE_POSITION;
    assembly {
      queue.slot := position
    }
  }

  function _getRequestsByOwner() internal pure returns (mapping(address => EnumerableSet.UintSet) storage requestsByOwner) {
    bytes32 position = REQUEST_BY_OWNER_POSITION;
    assembly {
        requestsByOwner.slot := position
    }
  }
}
