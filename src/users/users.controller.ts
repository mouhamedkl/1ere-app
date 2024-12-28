import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './entities/user.entity';
import { Roles } from './../roles/roles.decorator';
import { RolesGuard } from './../roles/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Appliqué globalement
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN) //admins
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN) // Accessible uniquement aux admins
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN) // Accessible uniquement aux admins
  @ApiOperation({ summary: 'Get a single user (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN) // Accessible uniquement aux admins
  @ApiOperation({ summary: 'Update a user (Admin only)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Accessible uniquement aux admins
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Post('admin')
  @Roles(Role.ADMIN) // Accessible uniquement aux admins
  @ApiOperation({ summary: 'Admin-only route' })
  async adminRoute() {
    return { message: 'Hello Admin!' };
  }

  @Post('user')
  @Roles(Role.USER, Role.ADMIN) // Accessible aux utilisateurs ou admins
  @ApiOperation({ summary: 'User or Admin route' })
  async userRoute() {
    return { message: 'Hello User or Admin!' };
  }
}
