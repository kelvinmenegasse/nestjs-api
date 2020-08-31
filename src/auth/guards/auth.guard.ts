import { ExecutionContext, Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { AuthPayload } from '../dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(
        private configService: ConfigService,
        @Inject('AuthService') private readonly authService: AuthService
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        // const request = context.switchToHttp().getRequest();
        
        const request = context.switchToHttp().getRequest();

        this.validateRequest(request);

        return super.canActivate(context);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleRequest(err, user, info) {
        if (err) { throw err; }

        if (!user) {
            // token expirou, se foi a menos de uma hora ou igual, renova
            // se nao, erro 400

            if (info.name === 'TokenExpiredError') {

                throw new UnauthorizedException();
            }

            throw new BadRequestException;

        }

        return user;
    }

    validateRequest(request: Request): void {
        const headers = request.headers;

        if (headers.authorization) {
            const token: string = this.extractJWT(headers.authorization);
            const payload: AuthPayload | any = this.authService.jwtService.decode(token);

            // check payload rnw date
            if (payload.rnw) {
                
            }
        }
    }

    extractJWT(bearerToken: string): string {
        const token: string = bearerToken.split(' ')[1];
        return token;
    }
}
