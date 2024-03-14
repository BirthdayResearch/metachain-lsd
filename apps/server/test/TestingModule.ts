import * as child_process from 'node:child_process';

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StartedPostgreSqlContainer } from '@stickyjs/testcontainers';

import { AppConfig, DeepPartial} from "../src/AppConfig";
import { AppModule} from "../src/AppModule";

@Module({})
export class TestingModule {
    static register(config: AppConfig): DynamicModule {
        return {
            module: TestingModule,
            imports: [AppModule, ConfigModule.forFeature(() => config)],
        };
    }
}

export function buildTestConfig({
                                    startedPostgresContainer,
                                }: BuildTestConfigParams) {
    if (startedPostgresContainer === undefined) {
        throw Error('Must pass in StartedPostgresContainer');
    }
    const dbUrl = `postgres://${startedPostgresContainer.getUsername()}:${startedPostgresContainer.getPassword()}@${startedPostgresContainer.getHost()}:${startedPostgresContainer.getPort()}`;
    child_process.execSync(`export DATABASE_URL=${dbUrl} && pnpm prisma migrate deploy`);
    return {
        dbUrl: dbUrl ?? ''
    };
}

type BuildTestConfigParams = DeepPartial<OptionalBuildTestConfigParams> & {
    startedPostgresContainer: StartedPostgreSqlContainer;
};

type OptionalBuildTestConfigParams = {
    dbUrl: string;
};
