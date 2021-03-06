import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { AddAccountDTO, UpdateAccountDTO, FindAccountDTO } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
        private configService: ConfigService,
    ) {
        const account = Object.assign(new Account(), this.configService.get('accountAdminConfig'));
        this.insertAdminUser(account);
    }

    async fetchAll(): Promise<Account[]> {
        return await this.accountsRepository.find({ status: 'ativo'});
    }

    async getByID(id: number): Promise<Account>{
        return await this.accountsRepository.findOne({ id });
    }

    async getByUsername(username: string): Promise<Account>{
        return await this.accountsRepository.findOne({ username });
    }

    async find(findAccountDTO: FindAccountDTO): Promise<Account>{
        return await this.accountsRepository.findOne({ where: findAccountDTO });
    }

    async addAccount(account: AddAccountDTO): Promise<Account> {

        const { username } = account;

        const isUsernameFound = await this.accountsRepository.findOne({ username });

        if (isUsernameFound) {
            throw new BadRequestException(`Usuário "${username}" já cadastrado`);
        }

        const newAccount = Object.assign(new Account(), account);

        return await this.accountsRepository.save(newAccount);
    }

    async updateAccount(account: UpdateAccountDTO): Promise<Account> {
        
        const id: number = account.id;

        const accountFound = await this.accountsRepository.findOne({ id });

        if (!accountFound) {
            throw new NotFoundException(`Conta com ID "${id}" não encontrada`);
        }

        const updatedAccount = Object.assign(accountFound, account);

        return await this.accountsRepository.save(updatedAccount);
    }

    async removeAccount(id: number): Promise<Account> {

        const accountFound = await this.accountsRepository.findOne({ id });

        if (!accountFound) {
            throw new NotFoundException(`Conta com ID "${id}" não encontrada`);
        }

        const newAccount = Object.assign(accountFound, {
            status: 'removido'
        });

        return await this.accountsRepository.save(newAccount);

    }

    async permanentlyDeleteAccount(id: number): Promise<any> {

        let accountFound = await this.accountsRepository.findOne({ id });

        if (!accountFound) {
            throw new NotFoundException(`Conta com ID "${id}" não encontrada`);
        }

        await this.accountsRepository.delete(id);

        accountFound = await this.accountsRepository.findOne({ id });

        if (accountFound) {
            return JSON.stringify({
                message: `Não foi possível deletar a conta com ID "${id}"`,
                type: 'error',
            });
        }

        return JSON.stringify({
            message: 'Deletado com sucesso',
            type: 'success',
        });

    }

    async getActiveUsername(username: string): Promise<Account>{
        return await this.accountsRepository.findOne({
            username, status: 'ativo' }
        );
    }
    
    async generateRecoveryKey(account: Account): Promise<Account> {
        
        account.generateRecoveryKey();
        
        return await this.accountsRepository.save(account);
    }    
    
    async verifyRecoveryKey(username: string, recoveryKey: string): Promise<Account>{
        return await this.accountsRepository.findOne({
            where:
                { username, recoveryKey, status: 'ativo' }
        });
    }

    async changePasswordWithRecoveryKey(account: Account, newPassword: string): Promise<Account> {

        account.hashPassword(newPassword);
        account.recoveryKey = null;

        return await this.accountsRepository.save(account);
    }

    async insertAdminUser(account: Account): Promise<void> {
        const accountFound = await this.find({
            id: account.id,
            username: account.username
        });

        if (!accountFound) {
            const newAccount = await this.addAccount(account);
            console.log(`ADMIN ACCOUNT "${newAccount.username.toUpperCase()}" CREATED`);
        }
    }
    
}
