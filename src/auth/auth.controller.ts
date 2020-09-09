import { Controller, Logger, Post, UsePipes, ValidationPipe, Body, UseGuards } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AuthService } from './auth.service';
import { CredentialsDTO, AuthPayload, RecoveryCredentialsDTO } from './dto';

@Controller('api/auth')
export class AuthController {

    private logger = new Logger(AppController.name);

    constructor(private authService: AuthService) { }

    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() credentialsDTO: CredentialsDTO): Promise<string> {
        return await this.authService.login(credentialsDTO);
    }

    @Post('verify-token')
    @UsePipes(ValidationPipe)
    async verifyToken(@Body() token: string): Promise<string> {
        return await this.authService.verify(token);
    }

    @Post('refresh-token')
    @UsePipes(ValidationPipe)
    async refreshToken(@Body() expiredToken: string): Promise<string> {
        return await this.authService.refresh(expiredToken);
    }

    @Post('send-recovery-key')
    @UsePipes(ValidationPipe)
    async sendRecoveryKey(@Body() username: string): Promise<any> {
        return await this.authService.sendRecoveryKey(username);
    }
    
    
    @Post('login-recovery-key')
    @UsePipes(ValidationPipe)
    async loginRecoveryKey(@Body() recoveryCredentialsDTO: RecoveryCredentialsDTO): Promise<any> {
        return await this.authService.loginRecoveryKey(recoveryCredentialsDTO);
    }


}


    // login => req credentials res token
    // verify token req token res true/false
    // refresh token req token res token
    // send recovery key  req username send email with recovery key
    // login recovery key credentials + recovery key