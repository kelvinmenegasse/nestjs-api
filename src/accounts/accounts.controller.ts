import { Controller, Post, Get, Body, Param, UsePipes, ValidationPipe, Logger, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { UpdateAccountDTO, AddAccountDTO } from './dto';
import { ValidationParametersPipe } from 'src/shared/pipes/validation-parameters.pipe';
import { AppController } from 'src/app.controller';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('api/admin/accounts')
export class AccountsController {

    private logger = new Logger(AppController.name);

    constructor(private accountsService: AccountsService) { }

    @Get('list')
    @UseGuards(JwtAuthGuard)
    async listAccount(): Promise<any | null> {
        return await this.accountsService.fetchAll();
    }

    @Post('get:/id')
    @UseGuards(JwtAuthGuard)
    async getAccount(
        @Param('id', ValidationParametersPipe) accountID: number
    ): Promise<Account> {
        return await this.accountsService.getByID(accountID);
    }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async addAccount(@Body() addAccountDTO: AddAccountDTO): Promise<any | null> {
        return await this.accountsService.addAccount(addAccountDTO);
    }

    @Post('update/:id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async updateAccount(
        @Param('id', ValidationParametersPipe) accountID: number,
        @Body() updateAccountDTO: UpdateAccountDTO
    ): Promise<Account> {
        return await this.accountsService.updateAccount(accountID, updateAccountDTO);
    }

    @Post('remove/:id')
    @UseGuards(JwtAuthGuard)
    async removeAccount(
        @Param('id', ValidationParametersPipe) accountID: number
    ): Promise<Account> {
        return await this.accountsService.removeAccount(accountID);
    }

    @Post('delete/:id')
    @UseGuards(JwtAuthGuard)
    async permanentlyDeleteAccount(
        @Param('id', ValidationParametersPipe) accountID: number
    ): Promise<any> {
        return await this.accountsService.permanentlyDeleteAccount(accountID);
    }
}