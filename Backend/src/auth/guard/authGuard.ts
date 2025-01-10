import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = this.getAccessToken(request);

      if (!token) {
        throw new UnauthorizedException('UnAuthorised Access Denied');
      }

      const decoded = this.jwtService.verify(token);

      if (!decoded) {
        throw new UnauthorizedException('Invalid Token');
      }

      request.user = decoded;

      return true;
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Unauthorized: Invalid or Expired Token');
      }
      // For unexpected errors, rethrow the original error
      throw error;
    }
  }

  public getAccessToken(req: Request) {
    return req.headers['authorization']?.split(' ')[1];
  }
}
