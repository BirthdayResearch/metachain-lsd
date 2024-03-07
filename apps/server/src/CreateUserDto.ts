import {IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    email: string;
    constructor(email: string) {
        this.email = email;
    }
}
