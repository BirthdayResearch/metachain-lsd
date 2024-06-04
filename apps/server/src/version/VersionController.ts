import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SkipThrottle } from "@nestjs/throttler";

import { VersionModel } from "./VersionInterface";

@Controller("version")
export class VersionController {
  constructor(private configService: ConfigService) {}

  @SkipThrottle()
  @Get()
  public async getVersion(): Promise<VersionModel> {
    const version = this.configService.get<string>("APP_VERSION");
    return {
      v: version ?? "0.0.0",
    };
  }
}
