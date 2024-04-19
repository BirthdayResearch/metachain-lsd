import { Module } from "@nestjs/common";
import { PrismaService } from "./PrismaService";

@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
