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

  async processTransfer(network: EnvironmentNetwork) {
    console.log(`Initializing reward process: ${new Date().toISOString()}`);
    const walletProvider = new WalletProvider(
      network,
      this.whaleApiClient,
      this.configService,
    );
    const utxoBalance = await walletProvider.getUTXOBalance();
    // keep 1 UTXO for txn cost
    const conversionAmount = new BigNumber(utxoBalance).minus(1);
    if (conversionAmount.gt(0)) {
      await walletProvider.convertUtxoToToken(conversionAmount);
    }
    const tokenBalanceData = await walletProvider.getTokenBalance(
      "DFI",
      new BigNumber(0),
    );
    const tokenBalance = new BigNumber(tokenBalanceData?.amount ?? 0);
    // transfer DFI Token To EVM
    if (tokenBalance.gt(0)) {
      const { evmAddress } = await walletProvider.getAddress();
      await walletProvider.transferDFIToEVM(tokenBalance, evmAddress);
    }
    const evmBalance = await walletProvider.getEvmBalance();
    // keep 1 EVM DFI for txn cost
    const rewardAmount = new BigNumber(evmBalance).minus(
      parseEther("1").toString(),
    );
    if (rewardAmount.gt(0)) {
      const rewardsTxn = await walletProvider.transferEvmRewards(
        rewardAmount.toString(),
      );
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
}
