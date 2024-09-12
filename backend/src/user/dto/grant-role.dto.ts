import { Role } from 'src/user/entities/role.entity';

export class GrantRoleDto {
  role: Role;
  username: string;
}
