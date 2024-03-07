import { Body, Controller, Post } from "@nestjs/common";
import { SubscriptionStatus } from '@prisma/client';
import { UserService } from "./UserService";
import {MultiEnumValidationPipe} from "../pipes/MultiEnumValidationPipe";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body("email") email: string,
    @Body('status', new MultiEnumValidationPipe(SubscriptionStatus)) status?: SubscriptionStatus[]
  ) {
    return this.userService.createUser({email, status});
  }
}
