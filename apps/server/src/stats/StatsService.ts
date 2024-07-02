import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StatsModel } from "./StatsInterface";
import { EnvironmentNetwork } from "@waveshq/walletkit-core";
import { Contract, JsonRpcProvider, formatEther, parseEther } from "ethers";
import { MarbleLsdV1__factory } from "smartcontracts";

@Injectable()
export class StatsService {
  constructor(private configService: ConfigService) {}

  async getStats(network: EnvironmentNetwork): Promise<StatsModel> {
    try {
      const marbleFiContractAddress =
        this.configService.getOrThrow<EnvironmentNetwork>(
          `defichain.${network}.marbleFiContractAddress`
        );
      const ethRPCUrl = this.configService.getOrThrow<EnvironmentNetwork>(
        `defichain.${network}.ethRPCUrl`
      );
      const evmProvider = new JsonRpcProvider(ethRPCUrl);
      const marbleFiProxy = new Contract(
        marbleFiContractAddress,
        MarbleLsdV1__factory.abi,
        evmProvider
      );
      const shares = await marbleFiProxy.totalShares();
      const totalAssets = await marbleFiProxy.totalStakedAssets();
      const totalRewardAssets = await marbleFiProxy.totalRewardAssets();
      const mDfiDfiRatio = await marbleFiProxy.convertToAssets(parseEther("1"));
      return {
        totalShares: formatEther(shares ?? 0),
        totalAssets: formatEther(totalAssets ?? 0),
        totalRewards: formatEther(totalRewardAssets ?? 0),
        mDfiDfiRatio: formatEther(mDfiDfiRatio ?? 0),
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
