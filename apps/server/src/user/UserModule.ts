import { Module } from '@nestjs/common';
import {UserController} from "./UserController";
import {UserService} from "./UserService";
import {PrismaService} from "../PrismaService";

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService],
    exports: [UserService]
})
export class UserModule {}
