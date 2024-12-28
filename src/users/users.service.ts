import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({id});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.userRepository.update(id,updateUserDto)
    return this.userRepository.findOneBy({id});
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOneBy({id});
      if (!user) {
        return null;  
      }
      await this.userRepository.remove(user);
      return user;
    } catch (error) {
      console.error('Error removing user:', error);
      throw error; 
    }
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }
}
