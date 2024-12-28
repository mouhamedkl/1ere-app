import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../users/entities/user.entity';  // Assure-toi d'importer l'énumération Role

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupère les rôles requis pour cette route spécifique
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true; // Si aucun rôle n'est requis, permet l'accès
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assure-toi que l'utilisateur est attaché à la requête via le JWT
  console.log(user);
  
    // Si l'utilisateur n'a pas le rôle requis, lance une exception
    if (!user || !requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('You do not have the required role');
    }

    return true;
  }
}
