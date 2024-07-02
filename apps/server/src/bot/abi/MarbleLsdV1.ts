export default {
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "AMOUNT_IS_ZERO",
      type: "error",
    },
    {
      inputs: [],
      name: "BatchesAreNotSorted",
      type: "error",
    },
    {
      inputs: [],
      name: "CantSendValueRecipientMayHaveReverted",
      type: "error",
    },
    {
      inputs: [],
      name: "DEPOSIT_PAUSED",
      type: "error",
    },
    {
      inputs: [],
      name: "EmptyBatches",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "assets",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "max",
          type: "uint256",
        },
      ],
      name: "ExceededMaxDeposit",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "shares",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "max",
          type: "uint256",
        },
      ],
      name: "ExceededMaxRedeem",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "assets",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "max",
          type: "uint256",
        },
      ],
      name: "ExceededMaxWithdrawal",
      type: "error",
    },
    {
      inputs: [],
      name: "INVALID_FEES",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "sent",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxExpected",
          type: "uint256",
        },
      ],
      name: "InvalidAssetsToFinalize",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_requestId",
          type: "uint256",
        },
      ],
      name: "InvalidRequestId",
      type: "error",
    },
    {
      inputs: [],
      name: "LESS_THAN_MIN_DEPOSIT",
      type: "error",
    },
    {
      inputs: [],
      name: "LESS_THAN_MIN_WITHDRAWAL",
      type: "error",
    },
    {
      inputs: [],
      name: "NotEnoughAssets",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_sender",
          type: "address",
        },
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      name: "NotOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_requestId",
          type: "uint256",
        },
      ],
      name: "RequestAlreadyClaimed",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_requestId",
          type: "uint256",
        },
      ],
      name: "RequestNotFoundOrNotFinalized",
      type: "error",
    },
    {
      inputs: [],
      name: "WITHDRAWAL_PAUSED",
      type: "error",
    },
    {
      inputs: [],
      name: "ZERO_ADDRESS",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "previousAdmin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newAdmin",
          type: "address",
        },
      ],
      name: "AdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "beacon",
          type: "address",
        },
      ],
      name: "BeaconUpgraded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "assets",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "shares",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fees",
          type: "uint256",
        },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "oldAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "FEE_RECIEPIENT_ADDRESS_UPDATED",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "walletAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "FLUSH_FUND",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint16",
          name: "oldFee",
          type: "uint16",
        },
        {
          indexed: true,
          internalType: "uint16",
          name: "newFee",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "MINTING_FEES_UPDATED",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "oldAmount",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "newAmount",
          type: "uint256",
        },
      ],
      name: "MIN_DEPOSIT_UPDATED",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "oldAmount",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "newAmount",
          type: "uint256",
        },
      ],
      name: "MIN_WITHDRAWAL_UPDATED",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint16",
          name: "oldFee",
          type: "uint16",
        },
        {
          indexed: true,
          internalType: "uint16",
          name: "newFee",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "PERFORMANCE_FEES_UPDATED",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "status",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "PauseUnpauseDeposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "status",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "PauseUnpauseWithdrawal",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint16",
          name: "oldFee",
          type: "uint16",
        },
        {
          indexed: true,
          internalType: "uint16",
          name: "newFee",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "REDEMPTION_FEES_UPDATED",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "assets",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fees",
          type: "uint256",
        },
      ],
      name: "Rewards",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      name: "Upgraded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "oldAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newAddress",
          type: "address",
        },
      ],
      name: "WALLET_ADDRESS_UPDATED",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "requestId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountOfAssets",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesToBurn",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fees",
          type: "uint256",
        },
      ],
      name: "WithdrawalClaimed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "requestId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "assets",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "shares",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fees",
          type: "uint256",
        },
      ],
      name: "WithdrawalRequested",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "from",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "to",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountOfAssetsLocked",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sharesToBurn",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "WithdrawalsFinalized",
      type: "event",
    },
    {
      inputs: [],
      name: "ADMINISTRATOR_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "FINALIZE_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "NAME",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "REWARDS_DISTRIBUTER_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_requestId",
          type: "uint256",
        },
      ],
      name: "claimWithdrawal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "_requestIds",
          type: "uint256[]",
        },
      ],
      name: "claimWithdrawals",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_shares",
          type: "uint256",
        },
      ],
      name: "convertToAssets",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_assets",
          type: "uint256",
        },
      ],
      name: "convertToShares",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_receiver",
          type: "address",
        },
      ],
      name: "deposit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "feesRecipientAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_lastRequestIdToBeFinalized",
          type: "uint256",
        },
      ],
      name: "finalize",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "flushFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAvailableFundsToFlush",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      name: "getWithdrawalRequests",
      outputs: [
        {
          internalType: "uint256[]",
          name: "requestsIds",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "_requestIds",
          type: "uint256[]",
        },
      ],
      name: "getWithdrawalStatus",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "amountOfAssets",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountOfShares",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountOfFees",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isFinalized",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "isClaimed",
              type: "bool",
            },
          ],
          internalType: "struct MarbleLsdQueue.WithdrawalRequestStatus[]",
          name: "statuses",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "hasRole",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_adminAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_administratorAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_rewardDistributerAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_finalizerAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_walletAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_feesRecipientAddress",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "isDepositPaused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isWithdrawalPaused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lastFinalizedRequestId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lastRequestId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lockedAssets",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "maxDeposit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      name: "maxRedeem",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      name: "maxWithdrawal",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minDeposit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minWithdrawal",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "mintingFees",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "performanceFees",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "_batches",
          type: "uint256[]",
        },
      ],
      name: "prefinalize",
      outputs: [
        {
          internalType: "uint256",
          name: "assetsToLock",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "sharesToBurn",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_assets",
          type: "uint256",
        },
      ],
      name: "previewDeposit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_shares",
          type: "uint256",
        },
      ],
      name: "previewRedeem",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_assets",
          type: "uint256",
        },
      ],
      name: "previewWithdrawal",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "proxiableUUID",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "redemptionFees",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_shares",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_receiver",
          type: "address",
        },
      ],
      name: "requestRedeem",
      outputs: [
        {
          internalType: "uint256",
          name: "requestId",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_assets",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_receiver",
          type: "address",
        },
      ],
      name: "requestWithdrawal",
      outputs: [
        {
          internalType: "uint256",
          name: "requestId",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_paused",
          type: "bool",
        },
      ],
      name: "setDepositPaused",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_paused",
          type: "bool",
        },
      ],
      name: "setWithdrawalPaused",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "shareToken",
      outputs: [
        {
          internalType: "contract ShareToken",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalAssets",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalRewardAssets",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalShares",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalStakedAssets",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "unfinalizedAssets",
      outputs: [
        {
          internalType: "uint256",
          name: "assets",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "fees",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "unfinalizedRequestNumber",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newAddress",
          type: "address",
        },
      ],
      name: "updateFeesRecipientAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "updateMinDeposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "updateMinWithdrawal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_fees",
          type: "uint16",
        },
      ],
      name: "updateMintingFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_fees",
          type: "uint16",
        },
      ],
      name: "updatePerformanceFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_fees",
          type: "uint16",
        },
      ],
      name: "updateRedemptionFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newAddress",
          type: "address",
        },
      ],
      name: "updateWalletAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newImplementation",
          type: "address",
        },
      ],
      name: "upgradeTo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newImplementation",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "upgradeToAndCall",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "version",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "walletAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ],
};
