import {Body, Injectable} from '@nestjs/common';
import {PrismaService} from "../PrismaService";
import {CreateUserDto} from "../CreateUserDto";
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    // async create(@Body() createUserDto: CreateUserDto) {
    //     console.log(createUserDto)
    //     const data = await this.prisma.user.create({
    //         data: {
    //             email: createUserDto.email
    //         },
    //     })
    //     return {
    //         email: data.email
    //     };
    // }
    async get(postWhereUniqueInput: any) {
        try {
            const result = await this.prismaService.user.findUnique({
                where: postWhereUniqueInput,
            });
            return result;
        } catch (error) {
            console.error('Error in get method:', error);
            throw error;
        }
    }

    async createUser(data): Promise<User> {
        return this.prismaService.user.create({
            data:{
                email: "test2"
            }
        });
    }
}
