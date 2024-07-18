import { ConfigService } from "@nestjs/config";
import { EnvironmentNetwork } from "@waveshq/walletkit-core";
import { MarbleLsdV1__factory } from "smartcontracts";
import { Injectable } from "@nestjs/common";
import { JsonRpcProvider, Interface, Log } from "ethers";
import BigNumber from "bignumber.js";
import { PrismaService } from "../../PrismaService";

@Injectable()
export class SmartContractLogsProvider {
  private ethRPCUrl: string;
  private evmProvider: JsonRpcProvider;
  private marbleFiContractAddress: string;
  private marbleFiContractDeploymentHash: string;

  constructor(
    private readonly network: EnvironmentNetwork,
    private readonly configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.ethRPCUrl = this.configService.getOrThrow<EnvironmentNetwork>(
      `defichain.${this.network}.ethRPCUrl`,
    );
    this.evmProvider = new JsonRpcProvider(this.ethRPCUrl);
    this.marbleFiContractAddress =
      this.configService.getOrThrow<EnvironmentNetwork>(
        `defichain.${this.network}.marbleFiContractAddress`,
      );
    this.marbleFiContractDeploymentHash =
      this.configService.getOrThrow<EnvironmentNetwork>(
        `defichain.${this.network}.marbleFiContractDeploymentHash`,
      );
  }

  async getLogs(fromBlock, toBlock): Promise<Log[]> {
    try {
      const filter = {
        fromBlock,
        toBlock,
        address: this.marbleFiContractAddress,
      };
      return await this.evmProvider.getLogs(filter);
    } catch (err) {
      console.error(`Error occurred while finalize withdrawal: ${err.message}`);
    }
  }

  async saveLogs(log): Promise<void> {
    const marbleFiInterface = new Interface(MarbleLsdV1__factory.abi);
    const eventData = marbleFiInterface.parseLog(log);
    switch (eventData.name) {
      case "Deposit":
        await this.saveDepositsEvents(eventData, log);
        break;
      case "WithdrawalRequested":
        await this.saveWithdrawalRequestEvents(eventData, log);
        break;
      case "WithdrawalsFinalized":
        await this.saveWithdrawalFinalizeEvents(eventData, log);
        break;
      case "WithdrawalClaimed":
        await this.saveWithdrawalClaimedEvents(eventData, log);
        break;
      default:
    }
  }

  async saveDepositsEvents(eventData, { transactionHash }): Promise<void> {
    const [owner, receiver, assets, shares, fees] = eventData.args;
    await this.prismaService.scDepositEvents.createMany({
      data: [
        {
          network: this.network,
          txnHash: transactionHash,
          owner,
          receiver,
          assets: assets.toString(),
          shares: shares.toString(),
          fees: fees.toString(),
        },
      ],
      skipDuplicates: true,
    });
  }

  async saveWithdrawalRequestEvents(
    eventData,
    { transactionHash },
  ): Promise<void> {
    const [requestId, owner, receiver, assets, shares, fees] = eventData.args;
    await this.prismaService.scWithdrawalRequestEvents.createMany({
      data: [
        {
          network: this.network,
          requestId: requestId.toString(),
          txnHash: transactionHash,
          owner,
          receiver,
          assets: assets.toString(),
          shares: shares.toString(),
          fees: fees.toString(),
        },
      ],
      skipDuplicates: true,
    });
  }

  async saveWithdrawalFinalizeEvents(
    eventData,
    { transactionHash },
  ): Promise<void> {
    const [from, to, assets, shares, timestamp] = eventData.args;
    await this.prismaService.scWithdrawalFinalizeEvents.createMany({
      data: [
        {
          network: this.network,
          txnHash: transactionHash,
          from: from.toString(),
          to: to.toString(),
          assets: assets.toString(),
          shares: shares.toString(),
          timestamp: new Date(new BigNumber(timestamp).toNumber()),
        },
      ],
      skipDuplicates: true,
    });
  }

  async saveWithdrawalClaimedEvents(
    eventData,
    { transactionHash },
  ): Promise<void> {
    const [requestId, owner, receiver, assets, shares, fees] = eventData.args;
    await this.prismaService.scWithdrawalClaimEvents.createMany({
      data: [
        {
          network: this.network,
          txnHash: transactionHash,
          requestId: requestId.toString(),
          owner,
          receiver,
          assets: assets.toString(),
          shares: shares.toString(),
          fees: fees.toString(),
        },
      ],
      skipDuplicates: true,
    });
  }

  async getLastSyncBlockNumber() {
    const lstSyncedBlockData =
      await this.prismaService.scEventLastSyncedBlock.findFirst({
        where: { network: this.network },
      });
    if (lstSyncedBlockData?.blockNumber) {
      return lstSyncedBlockData?.blockNumber;
    }
    const creationTxnHash = await this.evmProvider.getTransaction(
      this.marbleFiContractDeploymentHash,
    );
    return creationTxnHash.blockNumber;
  }

  async updateLastSyncBlockNumber(blockNumber) {
    await this.prismaService.scEventLastSyncedBlock.upsert({
      where: { network: this.network },
      update: { blockNumber },
      create: { blockNumber, network: this.network },
    });
  }

  async getLatestBlock() {
    return await this.evmProvider.getBlockNumber();
  }
}
