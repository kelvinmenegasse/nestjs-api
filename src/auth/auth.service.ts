import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/accounts/entities/account.entity';
import { CredentialsDTO } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Account) private accountsRepository: Repository<Account>,
        private jwtService: JwtService
    ) { }


    async getByUsername(username: string): Promise<Account>{
        return await this.accountsRepository.findOne({ username });
    }

    async login(credentials: CredentialsDTO): Promise<any> {
        const { username, password } = credentials;
        console.log(new Date());

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

        const payload = {
            id: account.accountID,
            username: account.username,
            email: account.email,
            level: account.level,
            token: this.jwtService.sign({username: account.username})
        };

        return payload;
    }


    // login => req credentials res token
    // verify token req token res true/false
    // refresh token req token res token
    // send recovery key  req username send email with recovery key
    // login recovery key credentials + recovery key



}
