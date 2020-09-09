import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Account } from 'src/accounts/entities/account.entity';
import { CredentialsDTO, AuthPayload, RecoveryCredentialsDTO } from './dto';
import * as moment from 'moment';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        public jwtService: JwtService,
        private accountService: AccountsService,
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

        return this.createToken(account, rememberMe);
    }

    async refresh(expiredToken: string): Promise<string> {

        const payload: AuthPayload = this.jwtService.decode(expiredToken) as AuthPayload;

        if (!payload) {
            throw new BadRequestException();
        }

        const account: Account = await this.accountService.getActiveUsername(payload.username);

        if (!account) {
            throw new UnauthorizedException({
                "statusCode": 401,
                "message": "Unauthorized"
            });
        }

        const currentDate = moment().unix();

        const isAllowToRenewal = currentDate > payload.rnw;

        if (!isAllowToRenewal) {
            throw new UnauthorizedException({
                "statusCode": 401,
                "message": "Unauthorized"
            });
        }

        return this.createToken(account, payload.remember);

    }

    async verify(token: string): Promise<any> {

        const payload: AuthPayload = this.jwtService.decode(token) as AuthPayload;

        if (!payload) {
            throw new BadRequestException();
        }

        const account: Account = await this.accountService.getActiveUsername(payload.username);

        // corrigir no front end
        if (!account) {
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

    
    async sendRecoveryKey(username): Promise<any> {
        // verificar usuario
        // criar chave
        // salvar chave na conta
        // enviar chave por email e retornar o resultadp
        return null;
    }

    async loginRecoveryKey(recoveryRredentials: RecoveryCredentialsDTO): Promise<string> {
        const { username, newPassword, recoveryKey } = recoveryRredentials;

        const account: Account = await this.accountService.verifyRecoveryKey(username, recoveryKey);

        if (!account) {
            throw new UnauthorizedException(`Usuário e/ou código de recuperação inválido(s)`);
        }

        const updatedAccount = await this.accountService.changePasswordWithRecoveryKey(account, newPassword);

        return this.createToken(updatedAccount);
    }

    createToken(account: Account, remember = false): string {
        const rnwTimestamp = this.createRenewalTime();

        const token = this.jwtService.sign({
            id: account.accountID,
            username: account.username,
            email: account.email,
            level: account.level,
            remember: remember,
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



    // login => req credentials res token
    // verify token req token res true/false
    // refresh token req token res token
    // send recovery key  req username send email with recovery key
    // login recovery key credentials + recovery key



}
