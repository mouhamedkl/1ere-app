import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/entities/user.entity';  // Assure-toi que le Role est bien défini

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
