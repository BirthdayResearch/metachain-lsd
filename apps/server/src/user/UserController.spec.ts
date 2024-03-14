import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@stickyjs/testcontainers';
import { UserController} from "./UserController";
import { UserService} from "./UserService";
import {PrismaService} from "../PrismaService";

import { Request } from 'express';
import {buildTestConfig, TestingModule } from "../../test/TestingModule";
import {MarbleFiLsdServerTestingApp} from "../../dist/test-i9n/MarbleFiLsdServerTestingApp";

describe('UserController', () => {
    let testing: MarbleFiLsdServerTestingApp
    let userController: UserController;
    let userService: UserService;
    let prismaService: PrismaService
    let startedPostgresContainer: StartedPostgreSqlContainer;

    beforeAll(async () => {
        startedPostgresContainer = await new PostgreSqlContainer().start();
        testing = new MarbleFiLsdServerTestingApp(
            TestingModule.register(
                buildTestConfig({startedPostgresContainer}),
            ),
        );
        const app = await testing.start();

        // init postgres database
        prismaService = app.get<PrismaService>(PrismaService);
        userService = new UserService(prismaService);
        userController = new UserController(userService);
    });

    describe('create user', () => {
        it('should create a user in db', async () => {
            const req = { body: { email: "test@example.com", status: 'ACTIVE' } } as Request;

            const { email, status } = req.body;
            const res = await userController.create(email, status);

            expect(res).toEqual({ id: 1, email: 'test@example.com', status: 'ACTIVE' });
        });
    });
});