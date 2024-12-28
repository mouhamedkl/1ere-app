import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from './../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy:"jwt"}),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey', // Clé secrète 
      signOptions: { expiresIn: '1h' }, // Expiration 
    }),
    UsersModule,

  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
