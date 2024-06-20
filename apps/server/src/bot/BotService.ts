import { Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentNetwork } from "@waveshq/walletkit-core";
import { WalletProvider } from "./providers/WalletProvider";
import { WhaleApiClientProvider } from "./providers/WhaleApiClientProvider";
import BigNumber from "bignumber.js";
import { PrismaService } from "../PrismaService";
import { Network } from "@prisma/client";
import { parseEther } from "ethers";

@Controller("bot")
export class BotService {
  constructor(
    private configService: ConfigService,
    private whaleApiClient: WhaleApiClientProvider,
    private prismaService: PrismaService,
  ) {}

  async processRewards(network: EnvironmentNetwork) {
    console.log(`Initializing reward process: ${new Date().toISOString()}`);
    const privateKey = this.configService.getOrThrow<EnvironmentNetwork>(
      `defichain.${network}.rewardDistributerKey`,
    );
    const walletProvider = new WalletProvider(
      privateKey,
      network,
      this.whaleApiClient,
      this.configService,
    );
    await walletProvider.initWallet();
    // Retrieve UTXO balance and keep 1 UTXO for txn cost
    const utxoBalance = await walletProvider.getUTXOBalance();
    const conversionAmount = new BigNumber(utxoBalance).minus(1);

    // Convert UTXO to token if conversion amount is greater than 0
    if (conversionAmount.gt(0)) {
      await walletProvider.convertUtxoToToken(conversionAmount);
    }

    // Retrieve token balance and convert to BigNumber
    const tokenBalanceData = await walletProvider.getTokenBalance(
      "DFI",
      new BigNumber(0),
    );
    const tokenBalance = new BigNumber(tokenBalanceData?.amount ?? 0);

    // Transfer DFI Token To EVM
    if (tokenBalance.gt(0)) {
      const { evmAddress } = await walletProvider.getAddress();
      await walletProvider.convertDFIToEVM(tokenBalance, evmAddress);
    }

    // Retrieve EVM balance and keep 1 EVM DFI for txn cost
    const evmBalance = await walletProvider.getEvmBalance();
    const rewardAmount = new BigNumber(evmBalance).minus(1);

    // Send EVM rewards to reward address
    if (rewardAmount.gt(0)) {
      const rewardsTxn = await walletProvider.sendEvmRewards(
        parseEther(rewardAmount.toString()),
      );

      // Log and store reward transaction details
      if (rewardsTxn) {
        await this.prismaService.rewards.create({
          data: {
            network: network as Network,
            txnHash: rewardsTxn?.hash,
            amount: rewardsTxn?.value.toString(),
            fromAddress: rewardsTxn.from,
            toAddress: rewardsTxn.to,
          },
        });

        console.log(
          `Transferred rewards of ${rewardsTxn?.value.toString()} (fi) successfully to address ${rewardsTxn.to}`,
        );
      }
    }

    console.log(`Reward process completed: ${new Date().toISOString()}`);
  }

  async processWithdrawals(network: EnvironmentNetwork) {
    console.log(`Initializing reward process: ${new Date().toISOString()}`);
    const privateKey = this.configService.getOrThrow<EnvironmentNetwork>(
      `defichain.${network}.withdrawFinalizerKey`,
    );
    const walletProvider = new WalletProvider(
      privateKey,
      network,
      this.whaleApiClient,
      this.configService,
    );
    await walletProvider.initWallet();
    walletProvider.finalizeWithdrawalRequest("1", parseEther("1"));
  }
}
