import { Module } from "@nestjs/common";
import { appConfig, ENV_VALIDATION_SCHEMA } from "./AppConfig";
import { UserModule } from "./user/UserModule";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/PrismaHealthModule";
import { VersionModule } from "./version/VersionModule";
import { BotModule } from "./bot/BotModule";
import { ScheduleModule } from "@nestjs/schedule";
import { StatsModule } from "./stats/StatsModule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: ENV_VALIDATION_SCHEMA,
    }),
    UserModule,
    VersionModule,
    HealthModule,
    BotModule,
    StatsModule,
  ],
})
export class AppModule {}
