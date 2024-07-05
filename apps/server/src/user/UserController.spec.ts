import { HttpStatus } from "@nestjs/common";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@stickyjs/testcontainers";
import { PrismaService } from "../PrismaService";
import { buildTestConfig, TestingModule } from "../../test/TestingModule";
import { MarbleFiLsdServerTestingApp } from "../../test/MarbleFiLsdServerTestingApp";
import { SubscriptionStatus } from "@prisma/client";

describe.only("UserController", () => {
  jest.setTimeout(3600000);
  let testing: MarbleFiLsdServerTestingApp;
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
  });

  describe("create user", () => {
    it("should create an active user", async () => {
      const userData = {
        email: "test@example.com",
        status: SubscriptionStatus.ACTIVE,
      };
      const initialResponse = await testing.inject({
        method: "POST",
        url: "/user",
        payload: userData,
      });
      expect(initialResponse.statusCode).toStrictEqual(HttpStatus.CREATED);
      const response = JSON.parse(initialResponse.body);
      expect(response).toEqual(userData);
      const savedData = await prismaService.user.findFirst({
        where: { email: userData.email },
      });
      expect(response).toEqual({
        email: savedData.email,
        status: savedData.status,
      });
    });

    it("should create an inactive user", async () => {
      const userData = {
        email: "test_inactive@example.com",
        status: SubscriptionStatus.INACTIVE,
      };
      const initialResponse = await testing.inject({
        method: "POST",
        url: "/user",
        payload: userData,
      });
      expect(initialResponse.statusCode).toStrictEqual(HttpStatus.CREATED);
      const response = JSON.parse(initialResponse.body);
      expect(response).toEqual(userData);
      const savedData = await prismaService.user.findFirst({
        where: { email: userData.email },
      });
      expect(response).toEqual({
        email: savedData.email,
        status: savedData.status,
      });
    });

    it("should create an active user by default", async () => {
      const userData = {
        email: "test_default_active@example.com",
      };
      const initialResponse = await testing.inject({
        method: "POST",
        url: "/user",
        payload: userData,
      });
      expect(initialResponse.statusCode).toStrictEqual(HttpStatus.CREATED);
      const response = JSON.parse(initialResponse.body);
      expect(response).toEqual({
        status: SubscriptionStatus.ACTIVE,
        ...userData,
      });
      const savedData = await prismaService.user.findFirst({
        where: { email: userData.email },
      });
      expect(response).toEqual({
        email: savedData.email,
        status: savedData.status,
      });
    });

    it("should not create a user with same email", async () => {
      const userData = {
        email: "test@example.com",
        status: SubscriptionStatus.ACTIVE,
      };
      const initialResponse = await testing.inject({
        method: "POST",
        url: "/user",
        payload: userData,
      });
      const response = JSON.parse(initialResponse.body);
      expect(response.statusCode).toStrictEqual(HttpStatus.BAD_REQUEST);
      expect(response.message).toStrictEqual(
        "Duplicate email 'test@example.com' found in database",
      );
    });

    it("should not create a user with invalid email address", async () => {
      const initialResponse = await testing.inject({
        method: "POST",
        url: "/user",
        payload: {
          email: "invalid_email",
        },
      });
      const response = JSON.parse(initialResponse.body);
      expect(response.statusCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
