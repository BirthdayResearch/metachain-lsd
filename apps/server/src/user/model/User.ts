import { SubscriptionStatus } from "@prisma/client";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from "class-validator";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class createUserDTO {
  @IsDefined()
  @IsNotEmpty()
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
