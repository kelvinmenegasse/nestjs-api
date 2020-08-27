import { Controller, Logger, Post, UsePipes, ValidationPipe, Body, UseGuards } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AuthService } from './auth.service';
import { CredentialsDTO, AuthPayload } from './dto';

@Controller('api/auth')
export class AuthController {

    private logger = new Logger(AppController.name);

    constructor(private authService: AuthService) { }

    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() credentialsDTO: CredentialsDTO): Promise<AuthPayload> {
        return await this.authService.login(credentialsDTO);
    }

    @Post('verify-token')
    @UsePipes(ValidationPipe)
    async verifyToken(): Promise<any> {
        return null;
    }

    @Post('refresh-token')
    @UsePipes(ValidationPipe)
    async refreshToken(): Promise<any> {
        return null;
    }

    @Post('recovery-account')
    @UsePipes(ValidationPipe)
    async recoveryAccount(@Body() username: string): Promise<any> {
        return null;
    }
}


    // login => req credentials res token
    // verify token req token res true/false
    // refresh token req token res token
    // send recovery key  req username send email with recovery key
    // login recovery key credentials + recovery key