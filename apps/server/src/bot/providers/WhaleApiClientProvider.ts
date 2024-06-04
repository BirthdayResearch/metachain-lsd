import {
  WhaleApiClient,
  WhaleApiClientOptions,
} from "@defichain/whale-api-client";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  EnvironmentNetwork,
  newOceanOptions,
  newWhaleAPIClient,
} from "@waveshq/walletkit-core";

@Injectable()
export class WhaleApiClientProvider {
  private readonly clientCacheByNetwork: Map<
    EnvironmentNetwork,
    WhaleApiClient
  > = new Map();

  constructor(private configService: ConfigService) {}

  /**
   * Lazily initialises WhaleApiClients and caches them by network for performance.
   * @param network - the network to connect to
   */
  getClient(network: EnvironmentNetwork): WhaleApiClient {
    const client = this.clientCacheByNetwork.get(network);
    if (client !== undefined) {
      return client;
    }
    return this.createAndCacheClient(network);
  }

  private createAndCacheClient(network: EnvironmentNetwork): WhaleApiClient {
    const oceanOptions =
      network === EnvironmentNetwork.LocalPlayground
        ? ({
            url: this.configService.getOrThrow("defichain.whaleURL"),
            network: "regtest",
            version: "v0",
          } as WhaleApiClientOptions)
        : newOceanOptions(network);
    const client = newWhaleAPIClient(oceanOptions);
    this.clientCacheByNetwork.set(network, client);
    return client;
  }
}
