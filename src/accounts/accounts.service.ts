import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { AddAccountDTO, UpdateAccountDTO } from './dto';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
    ) { }

    async fetchAll(): Promise<Account[]> {
        return await this.accountsRepository.find({ status: 'ativo'});
    }

    async getByID(accountID: number): Promise<Account>{
        return await this.accountsRepository.findOne({ accountID });
    }

    async getByEmail(email: string): Promise<Account>{
        return await this.accountsRepository.findOne({ email });
    }

    async getByUsername(username: string): Promise<Account>{
        return await this.accountsRepository.findOne({ username });
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

    async updateAccount(accountID: number, updateAccount: UpdateAccountDTO): Promise<Account> {

        const accountFound = await this.accountsRepository.findOne({ accountID });

        if (!accountFound) {
            throw new NotFoundException(`Conta com ID "${accountID}" não encontrada`);
        }

        const newAccount = Object.assign(accountFound, updateAccount);

        return await this.accountsRepository.save(newAccount);
    }

    async removeAccount(accountID: number): Promise<Account> {

        const accountFound = await this.accountsRepository.findOne({ accountID });

        if (!accountFound) {
            throw new NotFoundException(`Conta com ID "${accountID}" não encontrada`);
        }

        const newAccount = Object.assign(accountFound, {
            status: 'removido'
        });

        return await this.accountsRepository.save(newAccount);

    }

    async permanentlyDeleteAccount(accountID: number): Promise<any> {

        const accountFound = await this.accountsRepository.findOne({ accountID });

        if (!accountFound) {
            throw new NotFoundException(`Conta com ID "${accountID}" não encontrada`);
        }

        return await this.accountsRepository.delete(accountID);

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
    
}
