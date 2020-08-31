import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Account } from 'src/accounts/entities/account.entity';
import { CredentialsDTO } from './dto';

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

        const rnw: Date = new Date();

        if (rememberMe) {
            rnw.setTime( 
                rnw.getTime() + 
                ( this.configService.get('jwtRenewalTimeLong') * 1000 )
            );
        } else {
            rnw.setTime( 
                rnw.getTime() + 
                ( this.configService.get('jwtRenewalTimeDefault') * 1000 )
            );
        }

        const token = this.jwtService.sign({
            id: account.accountID,
            username: account.username,
            email: account.email,
            level: account.level,
            rnw: rnw.toISOString()
        })

        return token;
    }


    // login => req credentials res token
    // verify token req token res true/false
    // refresh token req token res token
    // send recovery key  req username send email with recovery key
    // login recovery key credentials + recovery key



}
