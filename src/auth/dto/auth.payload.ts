import { IsString, IsNotEmpty, IsEmail, IsNumber, IsDate } from 'class-validator';

export class AuthPayload {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    level: string;

    @IsNotEmpty()
    @IsDate()
    rnw: Date;
}
