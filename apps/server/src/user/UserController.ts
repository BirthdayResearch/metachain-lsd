import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import {CreateUserDto} from "../CreateUserDto";
import {UserService} from "./UserService";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    async create(
        @Body('email') email: string
    ) {
        console.log(email)
        return this.userService.createUser(email);
    }
}
