import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from 'src/user/entities/role.entity';

export class UserRoleDto {
  @ApiProperty()
  role: RoleType;

  @ApiProperty()
  username: string;
}
