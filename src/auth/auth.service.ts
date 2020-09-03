import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Account } from 'src/accounts/entities/account.entity';
import { CredentialsDTO, AuthPayload } from './dto';
import * as moment from 'moment';

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        @InjectRepository(Account) private accountsRepository: Repository<Account>,
        public jwtService: JwtService
    ) { }


    async getByUsername(username: string): Promise<Account>{
        return await this.accountsRepository.findOne({ username });
    }

    async login(credentials: CredentialsDTO): Promise<any> {
        const { username, password, rememberMe } = credentials;

        const account: Account = await this.getByUsername(username);

        if (!account) {
            throw new UnauthorizedException(`Usuário não encontrado`);   
        }

        if (!account.isActive()) {
            throw new UnauthorizedException(`Usuário não encontrado`);
        }

        if (!account.comparePassword(password)) {
            throw new UnauthorizedException(`Senha inválida`);
        }

        const rnwTimestamp = this.createRenewalTime(rememberMe);

        const token = this.jwtService.sign({
            id: account.accountID,
            username: account.username,
            email: account.email,
            level: account.level,
            rnw: rnwTimestamp
        })

        return token;
    }

    async refresh(oldToken: string): Promise<any> {
        
        const payload: AuthPayload = this.jwtService.decode(oldToken) as AuthPayload;

        if (!payload) {
            throw new BadRequestException();
        }

        const currentDate = moment().unix();

        const isAllowToRenewal = currentDate > payload.rnw;

        if (isAllowToRenewal) {
            
            const account: Account = await this.getByUsername(payload.username);

            if (!account) {
                throw new UnauthorizedException(`Usuário não encontrado`);   
            }
    
            if (!account.isActive()) {
                throw new UnauthorizedException(`Usuário não encontrado`);
            }

            // get exp and rnw
            // check what strategy is implemented
            // if the one used is the long, then true
            const rnwTimestamp = this.createRenewalTime();

            const token = this.jwtService.sign({
                id: account.accountID,
                username: account.username,
                email: account.email,
                level: account.level,
                rnw: rnwTimestamp
            })
    
            return token;

        }   
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
