import { Controller } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EnvironmentNetwork } from "@waveshq/walletkit-core";
import { BotService } from "./BotService";
import { ConfigService } from "@nestjs/config";

@Controller("bot")
export class BotController {
  private networks: EnvironmentNetwork[];
  constructor(
    private configService: ConfigService,
    private botService: BotService,
  ) {
    const networkStr = this.configService.getOrThrow("botNetworks");
    this.networks = networkStr.split(",");
  }

  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  async initBot(): Promise<void> {
    for (let i = 0; i < this.networks.length; i++) {
      await this.botService.processTransfer(this.networks[i]);
    }
  }

  async onModuleInit() {
    await this.initBot();
  }
}
