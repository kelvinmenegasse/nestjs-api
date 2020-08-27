import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateAccountDTO {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsString()
    level: string;

    @IsOptional()
    @IsString()
    status: string;
}    
