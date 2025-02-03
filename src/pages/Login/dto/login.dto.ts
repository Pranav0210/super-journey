import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\[6-9]\d{9}$/, {
    message: "phoneNumber must be a valid 10 digit Indian phone number.",
  })
  phone: string;
}

export class VerifyOtpDto extends SendOtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: "incomplete otp" })
  otp: string;
}
