import { Module } from "@nestjs/common";
import { appConfig, ENV_VALIDATION_SCHEMA } from "./AppConfig";
import { UserModule } from "./user/UserModule";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/PrismaHealthModule";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: ENV_VALIDATION_SCHEMA,
    }),
    UserModule,
    HealthModule,
  ],
})
export class AppModule {}
