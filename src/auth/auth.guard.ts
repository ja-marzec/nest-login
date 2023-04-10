import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { TOKEN_TYPE, jwtConstants } from './constants';
  import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from './isPublic';
  
  interface Payload {
    username: string,
    sub: number,
    iat: number,
    exp: number
  }


  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest(); 
      const token = this.extractBearerToken(request);

      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      
      if (isPublic) {
        return true;
      }
      
      try {
        const payload : Payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request.user = payload;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractBearerToken(request: Request): string {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      if(type !== TOKEN_TYPE.BEARER) {
        throw new UnauthorizedException();
      } 

      return token 
    }
    
  }
  