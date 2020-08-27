import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    DatabaseModule,
    AccountsModule,
    AuthModule,
    DatabaseModule
  ],
  controllers: [
    AppController
  ],
  providers: [
  ],
})
export class AppModule { }
