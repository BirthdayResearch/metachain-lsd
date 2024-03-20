import { SubscriptionStatus } from "@prisma/client";
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export class createUserDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;
}
