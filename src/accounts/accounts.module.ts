import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    AuthModule
  ],
  controllers: [AccountsController],
  exports: [
    AccountsService
  ],
  providers: [
    AccountsService
  ]
})
export class AccountsModule { }
