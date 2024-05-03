import { SubscriptionStatus } from "@prisma/client";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from "class-validator";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class CreateUserDTO {
  @IsDefined({
    message: "Email should not be null or undefined",
  })
  @IsNotEmpty({
    message: "Email should not be empty",
  })
  @Matches(emailRegex, {
    message: "Invalid email format",
  })
  email: string;

  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;
}
