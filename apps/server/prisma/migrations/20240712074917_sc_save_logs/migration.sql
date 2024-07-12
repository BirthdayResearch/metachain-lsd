-- CreateTable
CREATE TABLE "ScDepositEvents" (
    "id" SERIAL NOT NULL,
    "txnHash" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "owner" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "shares" TEXT NOT NULL,
    "fees" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ScDepositEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScWithdrawalRequestEvents" (
    "id" SERIAL NOT NULL,
    "txnHash" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "requestId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "shares" TEXT NOT NULL,
    "fees" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ScWithdrawalRequestEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScWithdrawalFinalizeEvents" (
    "id" SERIAL NOT NULL,
    "txnHash" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "shares" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ScWithdrawalFinalizeEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScWithdrawalClaimEvents" (
    "id" SERIAL NOT NULL,
    "txnHash" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "requestId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "shares" TEXT NOT NULL,
    "fees" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ScWithdrawalClaimEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScRewardEvents" (
    "id" SERIAL NOT NULL,
    "txnHash" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "owner" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "fees" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ScRewardEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScUpdateEvents" (
    "id" SERIAL NOT NULL,
    "txnHash" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "name" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ScUpdateEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScEventLastSyncedBlock" (
    "id" SERIAL NOT NULL,
    "network" "Network" NOT NULL,
    "blockNumber" TEXT NOT NULL,

    CONSTRAINT "ScEventLastSyncedBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScDepositEvents_txnHash_network_key" ON "ScDepositEvents"("txnHash", "network");

-- CreateIndex
CREATE UNIQUE INDEX "ScWithdrawalRequestEvents_txnHash_network_key" ON "ScWithdrawalRequestEvents"("txnHash", "network");

-- CreateIndex
CREATE UNIQUE INDEX "ScWithdrawalFinalizeEvents_txnHash_network_key" ON "ScWithdrawalFinalizeEvents"("txnHash", "network");

-- CreateIndex
CREATE UNIQUE INDEX "ScWithdrawalClaimEvents_txnHash_network_key" ON "ScWithdrawalClaimEvents"("txnHash", "network");

-- CreateIndex
CREATE UNIQUE INDEX "ScRewardEvents_txnHash_network_key" ON "ScRewardEvents"("txnHash", "network");

-- CreateIndex
CREATE UNIQUE INDEX "ScUpdateEvents_txnHash_network_key" ON "ScUpdateEvents"("txnHash", "network");

-- CreateIndex
CREATE UNIQUE INDEX "ScEventLastSyncedBlock_network_key" ON "ScEventLastSyncedBlock"("network");
