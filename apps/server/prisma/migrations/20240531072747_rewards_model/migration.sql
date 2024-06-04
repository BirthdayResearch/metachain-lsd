-- CreateEnum
CREATE TYPE "Network" AS ENUM ('Local', 'Playground', 'MainNet', 'TestNet', 'DevNet', 'Changi');

-- CreateTable
CREATE TABLE "Rewards" (
    "id" SERIAL NOT NULL,
    "txnHash" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "amount" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rewards_txnHash_network_key" ON "Rewards"("txnHash", "network");
