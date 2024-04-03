import { HttpStatus } from "@nestjs/common";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@stickyjs/testcontainers";
import { UserController } from "./UserController";
import { UserService } from "./UserService";
import { PrismaService } from "../PrismaService";

import { buildTestConfig, TestingModule } from "../../test/TestingModule";
import { MarbleFiLsdServerTestingApp } from "../../test/MarbleFiLsdServerTestingApp";

describe("UserController", () => {
  jest.setTimeout(3600000);
  let testing: MarbleFiLsdServerTestingApp;
  let userController: UserController;
  let userService: UserService;
  let prismaService: PrismaService;
  let startedPostgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    startedPostgresContainer = await new PostgreSqlContainer().start();
    testing = new MarbleFiLsdServerTestingApp(
      TestingModule.register(buildTestConfig({ startedPostgresContainer })),
    );
    const app = await testing.start();

    // init postgres database
    prismaService = app.get<PrismaService>(PrismaService);
    userService = new UserService(prismaService);
    userController = new UserController(userService);
  });

  describe("create user", () => {
    it("should create an active user in db", async () => {
      const res = await userController.create("test@example.com", "ACTIVE");

      expect(res).toEqual({
        id: 1,
        email: "test@example.com",
        status: "ACTIVE",
      });
    });

    it("should create an inactive user in db", async () => {
      const res = await userController.create("test2@example.com", "INACTIVE");

      expect(res).toEqual({
        id: 2,
        email: "test2@example.com",
        status: "INACTIVE",
      });
    });

    it("should create an active user by default", async () => {
      const res = await userController.create("test3@example.com");

      expect(res).toEqual({
        id: 3,
        email: "test3@example.com",
        status: "ACTIVE",
      });
    });

    it("should not create a user with same email", async () => {
      try {
        await userController.create("test@example.com");
      } catch (e) {
        expect(e.response.statusCode).toStrictEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.message).toStrictEqual(
          `Duplicate email 'test@example.com' found in database`,
        );
      }
    });
  });
});
