import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer'
import { DatabaseModule } from './database/database.module';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { config } from './configs/env.config';;
import { mailerConfig } from './configs/mail.config';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    MailerModule.forRoot(mailerConfig),
    DatabaseModule,
    AccountsModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [
    AppController
  ],
  providers: [],
})
export class AppModule { }
