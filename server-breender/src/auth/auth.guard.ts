import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

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
      const authToken = token.replace(/bearer/gi, '').trim();  // Corrected case for the regex
      const payload = this.jwtService.verify<{ id: string }>(authToken, {
        secret: jwtSecret,
      });

      // Add userId to the request object
      request.authUserId = payload.id;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
