// src/users/initialize-admin.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';
import { Role } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CreateadminService {
  constructor(private readonly userService: UsersService) {}

  async createAdminIfNotExists() {
    const adminExists = await this.userService.findByEmail('admin@example.com'); // Vérifiez si l'admin existe déjà
    if (!adminExists) {
      const createAdminDto: CreateUserDto = {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'adminpassword', 
        role: Role.ADMIN, //  rôle admin
      };
      // hash mot de passe
      const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
      createAdminDto.password=hashedPassword
      await this.userService.create(createAdminDto); // Créez l'admin
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  }
}
