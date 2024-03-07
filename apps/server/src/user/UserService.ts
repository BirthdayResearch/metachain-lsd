import { Body, Injectable } from "@nestjs/common";
import { PrismaService } from "../PrismaService";
import { CreateUserDto } from "../CreateUserDto";
import { User, Prisma } from "@prisma/client";
import {createUserParams} from "./model/User";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser({email, status}: createUserParams): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: email,
        status: status[0]
      },
    });
  }
}
