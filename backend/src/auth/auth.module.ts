import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from './strategy/accesstoken.strategy';
import { JwtAccessTokenGuard } from './guard/accesstoken.guard';
import { UserModule } from 'src/user/user.module';
import { JwtRefreshTokenStrategy } from './strategy/refreshtoken.strategy';
import { JwtRefreshTokenGuard } from './guard/refreshtoken.guard';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessTokenStrategy,
    JwtAccessTokenGuard,
    JwtRefreshTokenStrategy,
    JwtRefreshTokenGuard,
  ],
})
export class AuthModule {}
