import { ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    renewalTime = this.configService.get('jwtRenewalTime');

    constructor(
        private configService: ConfigService
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        // const request = context.switchToHttp().getRequest();
        return super.canActivate(context);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleRequest(err, user, info) {
        if (err) { throw err; }

        if (!user) {
            // token expirou, se foi a menos de uma hora ou igual, renova
            // se nao, erro 400

            if (info.name === 'TokenExpiredError') {

                const expiredAt: any = new Date(info.expiredAt);
                const now: any = new Date();
                const str = (expiredAt.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " "));

                const diff = Math.round(Math.abs(now as any - expiredAt) / 1000);
                console.log(diff);
                console.log(this.renewalTime)
                console.log(`expirou em: ${str}`)
                
                if (diff <= this.renewalTime) {
                    throw new UnauthorizedException();
                }
            }

            throw new BadRequestException;

        }

        return user;
    }
}
