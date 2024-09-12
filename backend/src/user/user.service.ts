import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role, UserRole } from './entities/role.entity';
import { GrantRoleDto } from './dto/grant-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // TODO: 아이디/비밀번호 검증

    const existingUser = await this.findOneByUsername(createUserDto.username);
    if (existingUser) throw new Error(`USER_ALREADY_EXISTS`);
    const userInfo = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };
    const user = this.userRepository.create(userInfo);
    const res = await this.userRepository.save(user);
    const userRole = await this.createRole(user, Role.user);
    return res;
  }

  async createRole(user: User, role: Role) {
    const res = await this.userRoleRepository.save({
      role,
      user,
    });
    return res;
  }

  async findAll() {
    const result = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        nickname: true,
      },
    });
    return result;
  }

  async findOneByUsername(username: string) {
    const result = await this.userRepository.findOne({
      relations: ['roles'],
      where: {
        username,
      },
    });
    return result;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneByUsername(username);
    const raw_pw = updateUserDto.password;
    if (raw_pw) updateUserDto.password = await bcrypt.hash(raw_pw, 10);
    const updatedUser = {
      ...user,
      ...updateUserDto,
    };
    const result = await this.userRepository.save(updatedUser);
    return result;
  }

  async grantRole(grantRoleDto: GrantRoleDto) {
    const user = await this.findOneByUsername(grantRoleDto.username);
    if (!user) throw new Error(`GRANT_ROLE_USER_NOT_FOUND`);
    const res = await this.createRole(user, grantRoleDto.role);
    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
