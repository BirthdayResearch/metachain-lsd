import { Module } from "@nestjs/common";

import { VersionController } from "./VersionController";

@Module({
  imports: [],
  providers: [],
  controllers: [VersionController],
})
export class VersionModule {}
