import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
// import { PrismaModule } from "../PrismaModule";
import { HealthController } from "./PrismaHealthController";
import { PrismaHealthIndicator } from "./PrismaHealth";

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
