import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { authProviders } from './auth.providers';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';

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
    AuthService,
    JwtStrategy,
  ],
  exports: [
    PassportModule,
    JwtStrategy,
  ]
})
export class AuthModule { }
