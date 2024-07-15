import { Module } from "@nestjs/common";

import { StatsController } from "./StatsController";
import { StatsService } from "./StatsService";

@Module({
  providers: [StatsService],
  exports: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
