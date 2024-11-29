import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    try {
      const authToken = token.replace(/bearer/gim, '').trim();
      const payload = this.jwtService.verify(authToken, {
        secret: jwtSecret,
      });
      request.userId = payload.userId;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
