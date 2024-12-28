import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
export enum Role {
    USER = 'user',
    ADMIN = 'admin',
  }
@Entity() 
export class User {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column() 
  name: string;

  @Column({ unique: true }) 
  email: string;
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER, 
  })
  role: Role;
  @Column() 
  password: string;

}
