import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthenticationGuard implements CanActivate{
    
    constructor (private jwtService : JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        try {
            
            const request = context.switchToHttp().getRequest()

            const token = this.getAccessToken(request);
            
             console.log("My Token" ,token)
            if (!token) {
                 throw new UnauthorizedException("UnAuthorised Access Denied")
            }

            const decoded =  this.jwtService.verify(token);
            
           
            request.user = decoded

           
            return true;
            
        }
        catch (error) {
             throw new InternalServerErrorException(error)
        }

    }


    public getAccessToken (req : Request) {
         return req.headers["authorization"]?.split(" ")[1];
    }

}