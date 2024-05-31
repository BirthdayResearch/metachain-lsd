import { Module } from "@nestjs/common";

import { BotController } from "./BotController";
import { WhaleApiClientProvider } from "./providers/WhaleApiClientProvider";
import { BotService } from "./BotService";
import { PrismaService } from "src/PrismaService";

@Module({
  imports: [],
  providers: [BotService, PrismaService, WhaleApiClientProvider],
  controllers: [BotController],
})
export class BotModule {}
