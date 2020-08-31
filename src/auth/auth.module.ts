import { Module, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { authProviders } from './auth.providers';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    ...authProviders,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    JwtStrategy,
    AuthService,
  ],
  exports: [
    PassportModule,
    JwtStrategy,
    AuthService
  ]
})
export class AuthModule { }
