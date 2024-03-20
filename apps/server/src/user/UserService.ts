import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "../PrismaService";
import { User } from "@prisma/client";
import { createUserDTO } from "./model/User";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: createUserDTO): Promise<User> {
    const { email, status } = user;
    try {
      return await this.prismaService.user.create({
        data: {
          email: email,
          status: status,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(
          `Duplicate email '${email}' found in database`,
        );
      } else {
        throw new HttpException(
          {
            statusCode:
              e.status ?? (e.code || HttpStatus.INTERNAL_SERVER_ERROR),
            error: e.response?.error || "Internal server error",
            message: `API call for createUser was unsuccessful: ${e.message}`,
          },
          e.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: e,
          },
        );
      }
    }
  }
}
