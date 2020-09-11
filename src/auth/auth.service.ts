import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Account } from 'src/accounts/entities/account.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { CredentialsDTO, AuthPayload, RecoveryCredentialsDTO } from './dto';
import * as moment from 'moment';

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        public jwtService: JwtService,
        private accountService: AccountsService,
        private mailerService: MailerService,
    ) { }

    async login(credentials: CredentialsDTO): Promise<string> {
        const { username, password, rememberMe } = credentials;

        const account: Account = await this.accountService.getActiveUsername(username);

        if (!account) {
            throw new UnauthorizedException(`Usuário não encontrado`);
        }

        if (!account.comparePassword(password)) {
            throw new UnauthorizedException(`Senha inválida`);
        }

        console.log(rememberMe);
        return this.createToken(account, rememberMe);
    }

    async refresh(expiredToken: string): Promise<string> {

        const payload: AuthPayload = new AuthPayload(this.jwtService.decode(expiredToken) as AuthPayload);

        if (!payload) {
            throw new BadRequestException();
        }

        const account: Account = await this.accountService.getActiveUsername(payload.username);

        if (!account || !payload.isAllowToRenewal()) {
            throw new UnauthorizedException({
                "statusCode": 401,
                "message": "Unauthorized"
            });
        }

        return this.createToken(account, payload.remember);

    }

    async verify(token: string): Promise<any> {

        const payload: AuthPayload = new AuthPayload(this.jwtService.decode(token) as AuthPayload);

        if (!payload) {
            throw new BadRequestException();
        }

        const account: Account = await this.accountService.getActiveUsername(payload.username);

        if (!account || !payload.isAllowToRenewal()) {
            return JSON.stringify({
                message: 'Token invalid',
                type: 'error',
            });
        }

        return JSON.stringify({
            message: 'Token valid',
            type: 'success',
        });
    }


    async sendRecoveryKey(username: string): Promise<any> {

        const account: Account = await this.accountService.getActiveUsername(username);

        if (!account) {
            throw new UnauthorizedException(`Usuário não encontrado`);
        }

        const updatedAccount = await this.accountService.generateRecoveryKey(account);

        const mail = {
            to: account.email,
            from: 'noreply@application.com',
            subject: 'PMFR | Recuperação de Senha',
            template: 'recover-password',
            context: {
                currentTime: `${moment().format('DD/MM/YYYY HH:mm:ss')}`,
                recoveryKey: account.recoveryKey,
                fullname: account.fullname
            },
        }

        await this.mailerService.sendMail(mail);
        
        return updatedAccount;
    }

    async loginRecoveryKey(recoveryRredentials: RecoveryCredentialsDTO): Promise<string> {
        const { username, newPassword, recoveryKey } = recoveryRredentials;

        const account: Account = await this.accountService.verifyRecoveryKey(username, recoveryKey);

        if (!account) {
            throw new UnauthorizedException(`Usuário e/ou código de recuperação inválido(s)`);
        }

        const updatedAccount = await this.accountService.changePasswordWithRecoveryKey(account, newPassword);
        
        const mail = {
            to: account.email,
            from: 'noreply@application.com',
            subject: 'PMFR | Alerta de solicitação para alteração de senha',
            template: 'login-recover',
            context: {
                appName: 'Sistema',
                currentTime: `${moment().format('DD/MM/YYYY HH:mm:ss')}`,
                fullname: account.fullname
            },
        }

        await this.mailerService.sendMail(mail);

        return this.createToken(updatedAccount);
    }

    createToken(account: Account, rememberMe = false): string {
        const rnwTimestamp = this.createRenewalTime(rememberMe);

        const token = this.jwtService.sign({
            id: account.id,
            username: account.username,
            email: account.email,
            level: account.level,
            remember: rememberMe,
            rnw: rnwTimestamp
        });

        return token;
    }

    createRenewalTime(rememberMe = false): number {
        // create a utc date
        const rnw = moment();

        const renewalTimeOption = rememberMe ? 'jwtRenewalTimeLong' : 'jwtRenewalTimeDefault';

        const renewalTimeValue = this.configService.get(renewalTimeOption);

        rnw.add(renewalTimeValue, 's');

        // return a timestamp value
        return rnw.unix();
    }

    extractJWT(bearerToken: string): string {
        const token: string = bearerToken.split(' ')[1];
        return token;
    }


}
