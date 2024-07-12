import { Controller, Get, Query } from "@nestjs/common";
import { StatsModel } from "./StatsInterface";
import { StatsService } from "./StatsService";
import { EnvironmentNetwork } from "@waveshq/walletkit-core";

@Controller("stats")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  public async getStats(
    @Query() query?: { network: EnvironmentNetwork },
  ): Promise<StatsModel> {
    const envNetwork =
      query.network === EnvironmentNetwork.TestNet
        ? EnvironmentNetwork.TestNet
        : EnvironmentNetwork.MainNet;
    return this.statsService.getStats(envNetwork);
  }
}
