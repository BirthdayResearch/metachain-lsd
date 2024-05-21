// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/** @notice @dev
 * This error occurs when `_requestId` is invalid or zero
 */
  error InvalidRequestId(uint256 _requestId);

/** @notice @dev
 * This error occurs when provided empty batch
 */
  error EmptyBatches();

/** @notice @dev
 * This error occurs when provided batch array is not sorted
 */
  error BatchesAreNotSorted();

/** @notice @dev
 * This error occurs when provided too much assets to finalize
 */
  error InvalidAssetsToFinalize(uint256 sent, uint256 maxExpected);

/** @notice @dev
 * This error occurs when requested fund is not finalized
 */
  error RequestNotFoundOrNotFinalized(uint256 _requestId);

/** @notice @dev
 * This error occurs when request is already claimed
 */
  error RequestAlreadyClaimed(uint256 _requestId);

/** @notice @dev
 * This error occurs when there is not enough assets
 */
  error NotEnoughAssets();

/** @notice @dev
 * This error occurs when recipient refuse to receive assets
 */
  error CantSendValueRecipientMayHaveReverted();

/** @notice @dev
 * This error occurs when sender is not a owner
 */
  error NotOwner(address _sender, address _owner);

contract MarbleLsdQueue {
  using EnumerableSet for EnumerableSet.UintSet;

  /**
   * @dev Queue for withdrawal requests, indexes (requestId) start from 1
   */
  bytes32 internal constant QUEUE_POSITION = keccak256("WithdrawalQueue.queue");

  /**
   * @dev Withdrawal requests mapped to the owners
   */
  bytes32 internal constant REQUEST_BY_OWNER_POSITION =
  keccak256("WithdrawalQueue.requestsByOwner");

  /**
   * @dev Last index in request queue
   */
  uint256 public lastRequestId;

  /**
   * @dev Last index of finalized request in the queue
   */
  uint256 public lastFinalizedRequestId;

  /**
   * @dev Last index of finalized request in the queue
   */
  uint256 public lockedAssets;

  /**
   * @notice Emitted when withdrawal requested happen on smart contract
   * @param requestId Withdraw requestId
   * @param owner Owner address
   * @param receiver Recieving assets
   * @param assets Amount of asset that being staked
   * @param shares Amount of shares that being alloted
   * @param fees Amount of fees that being charged
   */
  event WithdrawalRequested(
    uint256 indexed requestId,
    address indexed owner,
    address indexed receiver,
    uint256 assets,
    uint256 shares,
    uint256 fees
  );

  /**
   * @notice Emitted when withdrawal requested is finalized
   * @param from Request id from where finalisation started
   * @param to Request id from where finalisation ended
   * @param amountOfAssetsLocked Amount of assets gets locked
   * @param sharesToBurn Amount of shares gets burned
   * @param timestamp Block time when finalisation occured
   */
  event WithdrawalsFinalized(
    uint256 indexed from,
    uint256 indexed to,
    uint256 amountOfAssetsLocked,
    uint256 sharesToBurn,
    uint256 timestamp
  );

  /**
   * @notice Emitted when withdrawal is claimed
   * @param requestId Request id for which claimed
   * @param owner Recieving assets
   * @param receiver Amount of assets gets locked
   * @param amountOfAssets Assets to transfer
   * @param sharesToBurn Shares buned
   * @param sharesToBurn Fees collected
   */

  event WithdrawalClaimed(
    uint256 indexed requestId,
    address indexed owner,
    address indexed receiver,
    uint256 amountOfAssets,
    uint256 sharesToBurn,
    uint256 fees
  );

  /**
   * @notice Structure representing a request for withdrawal
   */
  struct WithdrawalRequest {
    /// @notice Sum of the all assets submitted for withdrawals including this request
    uint256 cumulativeAssets;
    /// @notice Sum of the all shares locked for withdrawal including this request
    uint256 cumulativeShares;
    /// @notice Sum of the all fees for withdrawal including this request
    uint256 cumulativeFees;
    /// @notice Address that can claim
    address owner;
    /// @notice Address that can claim or transfer the request
    address receiver;
    /// @notice block.timestamp when the request was created
    uint40 timestamp;
    /// @notice Flag if the request was claimed
    bool claimed;
  }

  /**
   * @notice Output format struct for `_getWithdrawalStatus()` method
   */
  struct WithdrawalRequestStatus {
    /// @notice Asset amount requested for withdrawal
    uint256 amountOfAssets;
    /// @notice Amount of shares token locked on withdrawal queue for this request
    uint256 amountOfShares;
    /// @notice Amount of fees charged for withdrowal
    uint256 amountOfFees;
    /// @notice Owner address that can claim this request
    address owner;
    /// @notice Address that can receive DFI in this request
    address receiver;
    /// @notice Timestamp of when the request was created, in seconds
    uint256 timestamp;
    /// @notice true, if request is finalized
    bool isFinalized;
    /// @notice true, if request is claimed. Request is claimable if (isFinalized && !isClaimed)
    bool isClaimed;
  }

  /**
   * @dev Queue constructor
   */
  function _initializeQueue() internal {
    // setting dummy zero structs in checkpoints and queue beginning
    // to avoid uint underflows and related if-branches
    // 0-index is reserved as 'not_found' response in the interface everywhere
    _getQueue()[0] = WithdrawalRequest(
      0,
      0,
      0,
      address(0),
      address(0),
      uint40(block.timestamp),
      true
    );
  }

  /**
   * @notice Returns status for requests with provided ids
   * @param _requestIds array of withdrawal request ids
   */
  function getWithdrawalStatus(
    uint256[] calldata _requestIds
  ) external view returns (WithdrawalRequestStatus[] memory statuses) {
    statuses = new WithdrawalRequestStatus[](_requestIds.length);
    for (uint256 i; i < _requestIds.length; ++i) {
      statuses[i] = _getStatus(_requestIds[i]);
    }
  }

  /**
   * @notice Returns all withdrawal requests that belongs to the `_owner` address
   * @param _owner Owner address
   */
  function getWithdrawalRequests(
    address _owner
  ) external view returns (uint256[] memory requestsIds) {
    return _getRequestsByOwner()[_owner].values();
  }

  /**
   * @notice Checks finalization batches, calculates required Assets and amount of shares to burn
   * @param _batches Sorted array of request Ids for finalization batches
   */
  function prefinalize(
    uint256[] calldata _batches
  ) external view returns (uint256 assetsToLock, uint256 sharesToBurn) {
    // check zero array length
    if (_batches.length == 0) revert EmptyBatches();
    // check first item is already finalized or not
    if (_batches[0] <= lastFinalizedRequestId)
      revert InvalidRequestId(_batches[0]);
    // check last item is valid or not
    if (_batches[_batches.length - 1] > lastRequestId)
      revert InvalidRequestId(_batches[_batches.length - 1]);

    uint256 currentBatchIndex;
    uint256 prevBatchEndRequestId = lastFinalizedRequestId;
    WithdrawalRequest memory prevBatchEnd = _getQueue()[prevBatchEndRequestId];
    while (currentBatchIndex < _batches.length) {
      uint256 batchEndRequestId = _batches[currentBatchIndex];
      // check for sorted array with no duplicates
      if (batchEndRequestId <= prevBatchEndRequestId)
        revert BatchesAreNotSorted();

      WithdrawalRequest memory batchEnd = _getQueue()[batchEndRequestId];
      // calculate total assets, total shares & total fees from the given batch
      uint256 assetsDiff = batchEnd.cumulativeAssets -
              prevBatchEnd.cumulativeAssets;
      uint256 sharesDiff = batchEnd.cumulativeShares -
              prevBatchEnd.cumulativeShares;
      uint256 feesDiff = batchEnd.cumulativeFees - prevBatchEnd.cumulativeFees;
      // add assets and shares and fees
      assetsToLock = assetsToLock + assetsDiff + feesDiff;
      sharesToBurn += sharesDiff;
      // increment
      prevBatchEndRequestId = batchEndRequestId;
      prevBatchEnd = batchEnd;
      unchecked {
        ++currentBatchIndex;
      }
    }
  }

  /**
   * @notice Return the number of unfinalized requests in the queue
   */
  function unfinalizedRequestNumber() external view returns (uint256) {
    // unfinalized requests count
    return lastRequestId - lastFinalizedRequestId;
  }

  /**
   * @notice Returns the amount of assets and fees in the queue yet to be finalized
   */
  function unfinalizedAssets()
  external
  view
  returns (uint256 assets, uint256 fees)
  {
    // unfinalized assets & fees
    assets =
      _getQueue()[lastRequestId].cumulativeAssets -
      _getQueue()[lastFinalizedRequestId].cumulativeAssets;
    fees =
      _getQueue()[lastRequestId].cumulativeFees -
      _getQueue()[lastFinalizedRequestId].cumulativeFees;
  }

  /**
   * @dev Finalize requests in the queue
   * - MUST emit the WithdrawalsFinalized event.
   * @param _lastRequestIdToBeFinalized Finalize requests from last finalized one up to
   */
  function _finalize(
    uint256 _lastRequestIdToBeFinalized,
    uint256 _amountOfAssets
  ) internal {
    // check invalid request id
    if (_lastRequestIdToBeFinalized > lastRequestId)
      revert InvalidRequestId(_lastRequestIdToBeFinalized);
    // check already finalized or not
    if (_lastRequestIdToBeFinalized <= lastFinalizedRequestId)
      revert InvalidRequestId(_lastRequestIdToBeFinalized);

    WithdrawalRequest memory lastFinalizedRequest = _getQueue()[
          lastFinalizedRequestId
      ];
    WithdrawalRequest memory requestToFinalize = _getQueue()[
          _lastRequestIdToBeFinalized
      ];
    // calculate total assets, fees & shares from lastFinalized to the given request id
    uint256 assetsToFinalize = requestToFinalize.cumulativeAssets -
            lastFinalizedRequest.cumulativeAssets;
    uint256 feesToFinalize = requestToFinalize.cumulativeFees -
            lastFinalizedRequest.cumulativeFees;
    uint256 totalAssets = assetsToFinalize + feesToFinalize;
    uint256 sharesToBurn = requestToFinalize.cumulativeShares -
            lastFinalizedRequest.cumulativeShares;
    // check exact amount paid by finalizer to the contract
    if (_amountOfAssets != totalAssets)
      revert InvalidAssetsToFinalize(_amountOfAssets, totalAssets);

    uint256 firstRequestIdToFinalize = lastFinalizedRequestId + 1;
    // update Locked assets
    lockedAssets += _amountOfAssets;
    lastFinalizedRequestId = _lastRequestIdToBeFinalized;

    emit WithdrawalsFinalized(
      firstRequestIdToFinalize,
      _lastRequestIdToBeFinalized,
      _amountOfAssets,
      sharesToBurn,
      block.timestamp
    );
  }

  /**
   * @dev Claim the request and transfer locked assets to `_recipient`.
   * MUST emit the WithdrawalClaimed event.
   * @param _requestId Id of the request to claim
   */
  function _claim(
    uint256 _requestId,
    address _owner
  )
  internal
  returns (
    address receiver,
    uint256 assetsToTransfer,
    uint256 sharesToBurn,
    uint256 feesToTransfer
  )
  {
    // check for valid requestId
    if (_requestId > lastFinalizedRequestId)
      revert RequestNotFoundOrNotFinalized(_requestId);

    WithdrawalRequest storage request = _getQueue()[_requestId];
    // check if already claimed
    if (request.claimed) revert RequestAlreadyClaimed(_requestId);
    // check if the caller is owner or not
    if (request.owner != _owner) revert NotOwner(_owner, request.owner);

    // set claimed
    request.claimed = true;
    // remove request id from owners requestId set
    assert(_getRequestsByOwner()[request.owner].remove(_requestId));
    WithdrawalRequest memory prevRequest = _getQueue()[_requestId - 1];
    // calculate fees, assets to distribute  & shares to burn
    receiver = request.receiver;
    assetsToTransfer = request.cumulativeAssets - prevRequest.cumulativeAssets;
    sharesToBurn = request.cumulativeShares - prevRequest.cumulativeShares;
    feesToTransfer = request.cumulativeFees - prevRequest.cumulativeFees;
    lockedAssets = lockedAssets - assetsToTransfer - feesToTransfer;
  }

  /**
   * @dev Send values to _recipient address
   * @param _recipient Recipient address
   * @param _amount Amount to send
   */
  function _sendValue(address _recipient, uint256 _amount) internal {
    // check if amount exceeds current balance
    if (address(this).balance < _amount) revert NotEnoughAssets();
    // send to _recipient
    (bool success, ) = _recipient.call{value: _amount}("");
    // check token transfer failure
    if (!success) revert CantSendValueRecipientMayHaveReverted();
  }

  /**
   * @dev Creates a new `WithdrawalRequest` in the queue
   */
  function _enqueue(
    address _owner,
    address _receiver,
    uint256 _assets,
    uint256 _shares,
    uint256 _fees
  ) internal returns (uint256 requestId) {
    WithdrawalRequest memory lastRequest = _getQueue()[lastRequestId];
    // update cumulative values
    uint256 cumulativeAssets = lastRequest.cumulativeAssets + _assets;
    uint256 cumulativeShares = lastRequest.cumulativeShares + _shares;
    uint256 cumulativeFees = lastRequest.cumulativeFees + _fees;
    // increment requests count
    requestId = lastRequestId + 1;
    WithdrawalRequest memory newRequest = WithdrawalRequest(
      cumulativeAssets,
      cumulativeShares,
      cumulativeFees,
      _owner,
      _receiver,
      uint40(block.timestamp),
      false
    );
    // add new request
    _getQueue()[requestId] = newRequest;
    // add request under the caller
    assert(_getRequestsByOwner()[_owner].add(requestId));
    // update last request Id
    lastRequestId = requestId;
    emit WithdrawalRequested(
      requestId,
      _owner,
      _receiver,
      _assets,
      _shares,
      _fees
    );
  }

  /**
   * @dev Returns the status of the withdrawal
   * @param _requestId Request id
   */
  function _getStatus(
    uint256 _requestId
  ) internal view returns (WithdrawalRequestStatus memory status) {
    // check invalid request id
    if (_requestId == 0 || _requestId > lastRequestId) {
      // return dummy data
      status = WithdrawalRequestStatus(
        0,
        0,
        0,
        address(0),
        address(0),
        0,
        false,
        false
      );
    } else {
      WithdrawalRequest memory request = _getQueue()[_requestId];
      WithdrawalRequest memory previousRequest = _getQueue()[_requestId - 1];
      // prepare withdrawl request
      status = WithdrawalRequestStatus(
        request.cumulativeAssets - previousRequest.cumulativeAssets,
        request.cumulativeShares - previousRequest.cumulativeShares,
        request.cumulativeFees - previousRequest.cumulativeFees,
        request.owner,
        request.receiver,
        request.timestamp,
        _requestId <= lastFinalizedRequestId,
        request.claimed
      );
    }
  }

  /**
   * @dev Returns queue storage slot assignment
   */
  function _getQueue()
  internal
  pure
  returns (mapping(uint256 => WithdrawalRequest) storage queue)
  {
    bytes32 position = QUEUE_POSITION;
    assembly {
      queue.slot := position
    }
  }

  /**
   * @dev Returns request by owner storage slot assignment
   */
  function _getRequestsByOwner()
  internal
  pure
  returns (mapping(address => EnumerableSet.UintSet) storage requestsByOwner)
  {
    bytes32 position = REQUEST_BY_OWNER_POSITION;
    assembly {
      requestsByOwner.slot := position
    }
  }
}
