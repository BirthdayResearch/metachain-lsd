import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { UserService } from "./UserService";
import { CreateUserDTO } from "./model/User";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) user: CreateUserDTO,
  ) {
    return this.userService.createUser(user);
  }
}
