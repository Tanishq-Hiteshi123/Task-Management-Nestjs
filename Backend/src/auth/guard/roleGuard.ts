// Creating the role guard for authorization access :-

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {
    // Get the Reflector in contructor :-
    constructor (private reflector : Reflector , private jwtService : JwtService) {}
     canActivate (context : ExecutionContext) : boolean | Promise<boolean> | Observable<boolean> {
        
        const requiredRoles = this.reflector.get<string[]>('roles' , context.getHandler())

        if (!requiredRoles) {
            //  No role is specified for this handler , SO Continue :-
            return true;
        }

        const request = context.switchToHttp().getRequest();
    
        const token = request?.rawHeaders[1].split(" ")[1];
     
       
        if (!token) {
            throw new ForbiddenException('Access denied');
        }

        const userRole = this.jwtService.verify(token).role;

   
      
        if (!userRole) { 
            throw new ForbiddenException('Access denied for not having any role');
        }



       

        // Check if the user's role is allowed :- 

        const isAllowed = requiredRoles.some((availableRole) => userRole == availableRole);

        if (!isAllowed) {
             throw new UnauthorizedException("Your are not allowed to access this resource")
        }
        
        return true;

     }
}