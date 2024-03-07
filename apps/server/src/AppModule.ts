import { Module } from "@nestjs/common";
import { appConfig, ENV_VALIDATION_SCHEMA } from "./AppConfig";
import { UserModule } from "./user/UserModule";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: ENV_VALIDATION_SCHEMA,
    }),
    UserModule,
  ],
})
export class AppModule {}
