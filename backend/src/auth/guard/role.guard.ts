import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from 'src/user/entities/role.entity';
import { UserService } from 'src/user/user.service';

const ROLE_GUARD_KEY = 'roles';

export const Roles = (...roles: RoleType[]) =>
  SetMetadata(ROLE_GUARD_KEY, roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndMerge(ROLE_GUARD_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!requiredRoles) return true;

    const req = ctx.switchToHttp().getRequest();
    if (!req.user) return false;
    const user = await this.userService.findOneByUsername(req.user.username);

    // 교집합 찾기: role 수가 많지 않아 n^2 구현
    const intersect = user.roles.filter(({ role }) => {
      return requiredRoles.includes(role);
    });
    if (intersect.length === 0) return false;
    else return true;
  }
}
